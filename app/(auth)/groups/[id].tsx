import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay'
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

const groupsPage = () => {
    const navigation = useNavigation();
    const { id } = useGlobalSearchParams();
    const { user } = useAuth();
    const scrollViewRef = useRef<any>();

    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const getGroupInfo = async () => {
        const groupId = Array.isArray(id) ? id[0] : id;

        if (groupId) {
            const docRef = doc(firestoreDB, "groups", groupId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                navigation.setOptions({
                    headerTitle: docSnap.data().name
                })
            } else {
                console.log("No such document!");
            }
        }
    };

    const sendMessages = async () => {
        if (message.trim().length > 0) {
            const msg = message.trim();
            addDoc(collection(firestoreDB, `groups/${id}/messages`), {
                text: msg,
                from: user?.uid,
                createdAt: serverTimestamp(),
            });
            setMessage('');
        }
    };

    useEffect(() => {
        setLoadingMessages(true);

        const messagesCollection = collection(firestoreDB, `groups/${id}/messages`);
        const q = query(messagesCollection, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const newMessages = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            });
            setMessages(newMessages);
            setLoadingMessages(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: false });
            }, 100);
        }
    }, [messages]);

    useLayoutEffect(() => {
        getGroupInfo();
    }, [id]);

    const renderMessage = ({ item }: any) => {
        const isMe = item.from === user?.uid;

        return (
            <View style={[styles.messageContainer, isMe ? styles.userMessageContainer : styles.otherMessageContainer]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.time}>{item.createdAt?.toDate().toLocaleTimeString()}</Text>
            </View>
        );
    };

    return (
        <>
            <Spinner visible={loadingMessages} />
            {!loadingMessages && (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 130} style={styles.container}>
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={message} onChangeText={setMessage} multiline={true} />
                        <Button title="Send" onPress={sendMessages} />
                    </View>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: "#fff",
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        borderWidth: 10,
        marginVertical: 10,
        borderRadius: 15,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: "#dcf8c6",
        borderColor: "#dcf8c6",
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    messageText: {
        fontSize: 16,
    },
    time: {
        alignSelf: "flex-end",
        fontSize: 10,
        color: 'gray',
        marginTop: 5,
    },

});

export default groupsPage;