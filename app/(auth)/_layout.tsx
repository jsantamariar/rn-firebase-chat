import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const tabsLayout = () => {
    const { user } = useAuth();

    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                height: Platform.OS === 'ios' ? 100 : 70,
            },
            tabBarItemStyle: {
                margin: Platform.OS === 'ios' ? 5 : 15,
                borderRadius: 10,
            }
        }}>
            <Tabs.Screen
                name="groups"
                options={{
                    headerShown: false,
                    tabBarLabel: "Chat Groups",
                    tabBarLabelStyle: { color: "#000" },
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color="#000" size={size} />,
                }}
                redirect={!user}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "My Profile",
                    tabBarLabelStyle: { color: "#000" },
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color="#000" size={size} />,
                    headerTitle: "My Profile"
                }}
                redirect={!user}
            />
        </Tabs>
    )
};

export default tabsLayout;