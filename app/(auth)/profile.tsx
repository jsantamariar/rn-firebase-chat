import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';
import Skeleton from '@/components/Skeleton';

interface UserInfo {
    email?: string;
    username?: string;
};

const profile = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo>({ email: "", username: "" })
    const [loading, setLoading] = useState(false);

    const loadUserInfo = async () => {
        setLoading(true);
        try {
            const userDocument = await getDoc(doc(firestoreDB, "users", user?.uid as string));

            if (userDocument.exists()) {
                setUserInfo({ email: userDocument.data().email, username: userDocument.data().username });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUsername = async () => {
        Alert.prompt("Update your username", "Enter a new username", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: "Update",
                onPress: async (newUsername) => {
                    if (!newUsername) {
                        alert("You must enter a new usernamer!");
                        return;
                    }
                    try {
                        setLoading(true);
                        await updateDoc(doc(firestoreDB, "users", user?.uid as string), {
                            username: newUsername,
                        });
                        await loadUserInfo();
                    } catch (error: any) {
                        console.error(error);
                        alert("Error creating group: " + error.message);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    useEffect(() => {
        loadUserInfo();
    }, []);


    return (
        <View style={styles.container}>
            {loading && (
                <ScrollView>
                    {[...new Array(1)].map((_, index) => (
                        <Skeleton key={index} />
                    ))}
                </ScrollView>
            )}
            {!loading && (
                <View style={styles.card}>
                    <View style={styles.cardLabelContainer}>
                        <Text style={styles.label}>
                            Username:
                        </Text>
                        <Text style={styles.userInfo}>
                            {userInfo.username}
                        </Text>
                        <Ionicons onPress={handleUpdateUsername} name="create" size={24} color="#000" />
                    </View>
                    <View style={styles.cardLabelContainer}>
                        <Text style={styles.label}>
                            Email:
                        </Text>
                        <Text style={styles.userInfo}>
                            {userInfo.email}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    card: {
        marginBottom: 20,
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        elevation: 1,
    },
    cardLabelContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        margin: 12,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 9,
        padding: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    userInfo: {
        fontSize: 16
    }
});

export default profile