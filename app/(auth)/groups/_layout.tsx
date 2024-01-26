import LogoutButton from "@/components/LogoutButton";
import { Stack } from "expo-router";


const stackLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Chat Groups',
                    headerRight: () => <LogoutButton />
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{ headerTitle: "Chat" }}
            />
        </Stack>
    );
};

export default stackLayout;