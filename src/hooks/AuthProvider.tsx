import { useState, useEffect } from "react";
import { AuthContext, type UserType } from "./auth";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const logIn = (newUser: UserType) => setUser(newUser);
    const logOut = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
