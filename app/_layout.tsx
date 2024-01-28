import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { Href, Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const InitialLayout = () => {
    const { user, initialized } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (user && !inAuthGroup) {
            router.replace('/groups' as Href<string>);
        } else if (!user) {
            router.replace('/login');
        }
    }, [initialized, user]);

    return (
        <>
            {initialized ? (
                <>
                    <StatusBar barStyle={'dark-content'} backgroundColor={"#fff"} />
                    <Slot />
                </>
            ) : (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="gray" />
                </View>
            )}
        </>
    );
};

const rootLayout = () => {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center'
    },
});

export default rootLayout;