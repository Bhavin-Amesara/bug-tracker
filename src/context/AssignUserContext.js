import { createContext, useReducer, useEffect } from "react";

const AssignUserContext = createContext();

const assignUserReducer = (state, action) => {
    switch (action.type) {
        case "ASSIGN_USER":
            return {
                user: action.payload,
            };
        default:
            return state;
    }
}

const AssignUserContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(assignUserReducer, {
        user: null,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            dispatch({ type: "ASSIGN_USER", payload: JSON.parse(user) });
        }
    }
    , []);

        console.log(state, "from assign user context");

    return (
        <AssignUserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AssignUserContext.Provider>
    );
}

export { AssignUserContext, AssignUserContextProvider };