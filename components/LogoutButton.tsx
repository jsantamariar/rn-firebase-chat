import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { signOut } from "@firebase/auth";
import { firebaseAuth } from '@/config/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const LogoutButton = () => {
    const doLogout = () => {
        signOut(firebaseAuth);
    };

    return (
        <Pressable onPress={doLogout} style={styles.pressable}>
            <Ionicons name="log-out-outline" size={24} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        marginRight: 10
    }
});

export default LogoutButton