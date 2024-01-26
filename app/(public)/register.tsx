import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { createUserWithEmailAndPassword, UserCredential } from "@firebase/auth";
import { firebaseAuth, firestoreDB } from '@/config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const register = () => {
    const navigation = useNavigation<any>();

    const [username, setUsername] = useState('jorge');
    const [email, setEmail] = useState('jorge@test.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
            )
        });
    }, []);

    const handleRegistration = async () => {
        try {
            setLoading(true);
            const user = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            await createUserInformation(user);
        } catch (error: any) {
            alert("There was an error: " + error.message)
        } finally {
            setLoading(false);
        }
    };

    const createUserInformation = async (user: UserCredential) => {
        try {
            const docRef = doc(firestoreDB, `users/${user.user.uid}`);
            await setDoc(docRef, {
                username,
                email,
            });
        } catch (error: any) {
            console.log("Error in createUserInformation", error)
        }
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            <TextInput style={styles.textInput} value={username} onChangeText={setUsername} placeholder='Username' />
            <TextInput keyboardType="email-address" style={styles.textInput} placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput secureTextEntry style={styles.textInput} placeholder='Password' value={password} onChangeText={setPassword} />
            <Pressable style={styles.button} onPress={handleRegistration}>
                <Text style={styles.text}>Create account</Text>
            </Pressable>
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
    textInput: {
        height: 40,
        width: '100%',
        margin: 12,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 9,
        padding: 10,
    },
    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        marginVertical: 10
    },
    text: {
        color: "white"
    }
});

export default register;