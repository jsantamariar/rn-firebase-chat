import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, TextInput } from 'react-native';
import { Href, Link, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';
import Skeleton from '@/components/Skeleton';
import DeleteModal from '@/components/DeleteModal';

interface Group {
    id: string;
    from: string;
    createdAt: any[];
    name: string;
    description: string;
};

const groups = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isAndroidModalVisible, setIsAndroidModalVisible] = useState(false);
    const [newGroupText, setNewGroupText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<null | string>(null);

    const groupsCollection = collection(firestoreDB, "groups");

    const handleCreateNewGroup = async () => {
        try {
            setLoading(true);
            const doc = await addDoc(collection(firestoreDB, "groups"), {
                from: user?.uid,
                name: newGroupText,
                description: `This was created by ${user?.email}`,
                createdAt: serverTimestamp(),
            });
            const document = await getDoc(doc);
            router.push(`/groups/${document.id}`);
        } catch (error: any) {
            console.error(error);
            alert("Error creating group: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateGroups = async () => {
        if (Platform.OS === 'ios') {
            Alert.prompt("Create a new group", "Enter a new group name", [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: "Create Group",
                    onPress: async (inputGroupName) => {
                        if (!inputGroupName) {
                            alert("You must enter a group name!");
                            return;
                        }
                        try {
                            setLoading(true);
                            const doc = await addDoc(collection(firestoreDB, "groups"), {
                                from: user?.uid,
                                name: inputGroupName,
                                description: `This was created by ${user?.email}`,
                                createdAt: serverTimestamp(),
                            });
                            const document = await getDoc(doc);
                            router.push(`/groups/${document.id}`);
                        } catch (error: any) {
                            console.error(error);
                            alert("Error creating group: " + error.message);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]);
        } else {
            setIsAndroidModalVisible(true);
        }
    };

    const handleDeleteGroup = (groupId: string) => {
        setIsModalVisible(true);
        setSelectedGroupId(groupId);
    };

    const handleConfirmDeleteGroup = async (groupId: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(firestoreDB, "groups", groupId));
        } catch (error) {
            console.log(error)
        } finally {
            setIsModalVisible(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoadingGroups(true);
        const q = query(groupsCollection, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newGroups = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            });
            setGroups(newGroups as Group[]);
            setLoadingGroups(false);

        });
        return unsubscribe;
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Spinner visible={loading} />
                {loadingGroups && (
                    <ScrollView>
                        {[...new Array(8)].map((_, index) => (
                            <Skeleton key={index} />
                        ))}
                    </ScrollView>
                )}
                {!loadingGroups && groups.length === 0 && (
                    <View style={styles.notChatsContainer}>
                        <Text style={styles.notChatsText}>You haven't started any chat yet.</Text>
                        <Text style={styles.notChatsText}> Click on the plus button to start one</Text>
                    </View>
                )}
                {(!loading || !loadingGroups) && groups.length > 0 && (
                    <ScrollView>
                        {groups.map((group) => (
                            <View key={group.id} style={styles.groupCard}>
                                <Link href={`/groups/${group.id}` as Href<string>} asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.groupName}>{group.name}</Text>
                                        <Text style={styles.groupDescription}>{group.description}</Text>
                                    </TouchableOpacity>
                                </Link>
                                {group.from === user?.uid && (
                                    <TouchableOpacity onPress={() => handleDeleteGroup(group.id)} style={styles.trashIcon}>
                                        <Ionicons name="trash-bin-outline" size={24} color="#000" />
                                    </TouchableOpacity>
                                )}

                            </View>
                        ))}
                        {isModalVisible && (
                            <DeleteModal
                                modalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                onConfirm={handleConfirmDeleteGroup}
                                id={selectedGroupId}
                            />
                        )}
                    </ScrollView>
                )}
                <TouchableOpacity style={styles.fab} onPress={handleCreateGroups}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>

            </View>
            {isAndroidModalVisible && (
                <View>
                    <Dialog.Container visible={true}>
                        <Dialog.Title>Create New Group</Dialog.Title>
                        <Dialog.Description>
                            Insert a new group name
                            <TextInput
                                value={newGroupText}
                                onChangeText={setNewGroupText}
                                placeholder="Insert a new group name"
                                style={styles.inputField}
                            />
                        </Dialog.Description>
                        <Dialog.Button onPress={() => setIsAndroidModalVisible(false)} label="Cancel" />
                        <Dialog.Button onPress={handleCreateNewGroup} label="Create Group" />
                    </Dialog.Container>
                </View>
            )}

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
        backgroundColor: "#000",
        borderRadius: 30,
        elevation: 8,
    },
    groupCard: {
        marginVertical: 2,
        padding: 15,
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    groupDescription: {
        fontSize: 16,
    },
    notChatsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 50,
        gap: 5
    },
    notChatsText: {
        textAlign: 'center',
    },
    trashIcon: {
        marginLeft: 'auto'
    },
    inputField: {
        padding: 20,
        height: 20,
        width: '100%'
    }
});

export default groups