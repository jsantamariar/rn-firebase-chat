import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "@firebase/auth";
import Spinner from "react-native-loading-spinner-overlay";
import { firebaseAuth } from '@/config/FirebaseConfig';

const login = () => {
    const [email, setEmail] = useState('jorge@test.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error: any) {
            alert("There was an eror: " + error.message)
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.prompt("Forgot password", "Enter your email address", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: "Reset Password",
                onPress: async (email) => {
                    try {
                        setLoading(true);
                        await sendPasswordResetEmail(firebaseAuth, email as string);
                        alert("Password reset email sent");
                    } catch (error: any) {
                        alert(error.message)
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ])
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            <TextInput keyboardType="email-address" style={styles.textInput} placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput secureTextEntry style={styles.textInput} placeholder='Password' value={password} onChangeText={setPassword} />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.text}>Log In</Text>
            </Pressable>
            <View style={styles.questionsContainer}>
                <Link href="/register" asChild>
                    <Text>Don't have an account yet?</Text>
                </Link>
                <Text onPress={handleForgotPassword}>Forgot password?</Text>
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
    textInput: {
        height: 40,
        width: '100%',
        margin: 12,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 9,
        padding: 10
    },
    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        marginVertical: 10
    },
    text: {
        color: "white"
    },
    questionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 30
    },
});

export default login;

