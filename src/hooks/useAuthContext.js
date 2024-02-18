import { useContext } from "react";
import { AuthUserContext } from "../context/AuthUserContext";

export const useAuthContext = () => {
    const context = useContext(AuthUserContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }

    return context;
}