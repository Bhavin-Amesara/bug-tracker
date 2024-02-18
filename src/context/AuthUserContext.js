import { createContext, useReducer, useEffect } from "react";

const AuthUserContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                user: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
            };
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            dispatch({ type: "LOGIN", payload: JSON.parse(user) });
        }
    }, []);

    console.log(state, "from auth context");

    return (
        <AuthUserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthUserContext.Provider>
    );
}

export { AuthUserContext, AuthContextProvider };