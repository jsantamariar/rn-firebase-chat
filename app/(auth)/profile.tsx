import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TextInput, Button } from 'react-native'
import { useNavigation } from 'expo-router';
import Spinner from "react-native-loading-spinner-overlay"
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

const profile = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        const userDocument = await getDoc(doc(firestoreDB, "users", user?.uid as string));

        if (userDocument.exists()) {
            setUsername(userDocument.data().username);
        }
    };

    const handleUpdateUsername = async () => {
        try {
            setLoading(true);
            await updateDoc(doc(firestoreDB, "users", user?.uid as string), {
                username,
            });
            navigation.goBack();
        } catch (error) {
            console.log("There was an error: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            <View style={styles.card}>
                <TextInput style={styles.textInput} value={username} onChangeText={setUsername} />
                <Button title="Update username" onPress={handleUpdateUsername} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
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
    textInput: {
        height: 40,
        margin: 12,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 9,
        padding: 10
    },

});

export default profile