import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";

const tabsLayout = () => {
    const { user } = useAuth();

    return (
        <Tabs>
            <Tabs.Screen
                name="groups"
                options={{
                    headerShown: false,
                    tabBarLabel: "Chat Groups",
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} />,
                }}
                redirect={!user}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
                    headerTitle: "My Profile"
                }}
                redirect={!user}
            />
        </Tabs>
    )
};

export default tabsLayout;