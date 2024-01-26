import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Href, Link, useRouter } from 'expo-router';
import { addDoc, collection, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from '@expo/vector-icons';
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

interface Group {
    id: string;
    createdAt: any[];
    name: string;
    description: string;
};

const groups = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);

    const handleCreateGroups = async () => {
        setLoading(true);
        try {
            const doc = await addDoc(collection(firestoreDB, "groups"), {
                name: `Group ${Math.floor(Math.random() * 100) + 1}`,
                description: `This was created by ${user?.email}`,
                createdAt: serverTimestamp(),
            });
            const document = await getDoc(doc);
            router.push(`/groups/${document.id}`);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const groupsCollection = collection(firestoreDB, "groups");
        const q = query(groupsCollection, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newGroups = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            });
            setGroups(newGroups as Group[]);
        });

        return unsubscribe;
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Spinner visible={loading} />
                <ScrollView>
                    {groups.map((group) => (
                        <Link href={`/groups/${group.id}` as Href<string>} key={group.id} asChild>
                            <TouchableOpacity style={styles.groupCard}>
                                <Text style={styles.groupName}>{group.name}</Text>
                                <Text style={styles.groupDescription}>{group.description}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.fab} onPress={handleCreateGroups}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View >
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: "#03A9F4",
        borderRadius: 30,
        elevation: 8,
    },
    groupCard: {
        marginVertical: 5,
        padding: 15,
        backgroundColor: "#fff"
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    groupDescription: {
        fontSize: 16,
    },
});

export default groups