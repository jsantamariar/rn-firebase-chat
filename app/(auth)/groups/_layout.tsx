import { Stack } from "expo-router";
import LogoutButton from "@/components/LogoutButton";



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