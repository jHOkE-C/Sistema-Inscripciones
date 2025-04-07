import { createContext, useContext } from "react";
export type UserType = {
    token: string;
    usuario: string;
};

type AuthContextType = {
    user: UserType | null;
    logIn: (user: UserType) => void;
    logOut: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un UserProvider");
    }
    return context;
};
