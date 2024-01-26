import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDB } from '@/config/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

const groupsPage = () => {
    const { id } = useGlobalSearchParams();
    const { user } = useAuth();

    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);

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
        const messagesCollection = collection(firestoreDB, `groups/${id}/messages`);
        const q = query(messagesCollection, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            });
            setMessages(newMessages)
        });

        return unsubscribe;
    }, []);


    const RenderMessage = ({ item }: any) => {
        const isMe = item.from === user?.uid;

        return (
            <View style={[styles.messageContainer, isMe ? styles.userMessageContainer : styles.otherMessageContainer]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.time}>{item.createdAt?.toDate().toLocaleTimeString()}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
            <FlatList data={messages} renderItem={RenderMessage} keyExtractor={(item) => item.id} />
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={message} onChangeText={setMessage} multiline={true} />
                <Button title="Send" onPress={sendMessages} />
            </View>
        </KeyboardAvoidingView>
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
        marginTop: 10,
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
    }

});

export default groupsPage;