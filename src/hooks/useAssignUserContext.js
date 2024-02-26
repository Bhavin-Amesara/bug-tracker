import { useContext } from "react";
import { AssignUserContext } from "../context/AssignUserContext";

export const useAssignUserContext = () => {
    const context = useContext(AssignUserContext);

    if (!context) {
        throw new Error('useAssignUserContext must be used within an AssignUserProvider');
    }

    return context;
}