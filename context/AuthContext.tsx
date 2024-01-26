import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "@firebase/auth";
import { firebaseAuth } from "@/config/FirebaseConfig";

interface AuthProps {
    user?: User;
    initialized?: boolean;
};

const AuthContext = createContext<AuthProps>({});

export function useAuth() {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User>();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user as User);
            setInitialized(true);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, initialized }}>
            {children}
        </AuthContext.Provider>
    );
};
