import { createContext, useReducer } from 'react';

const IssueContext = createContext();

const issueReducer = (state, action) => {
    switch (action.type) {
        case "SET_ISSUES":
            return {
                issues: action.payload,
            };
        case "CREATE_ISSUE":
            return {
                issues: [action.payload, ...state.issues],
            };
        default:
            return state;
    }
}

const IssueContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(issueReducer, {
        issues: null,
    });

    return (
        <IssueContext.Provider value={{ ...state, dispatch }}>
            {children}
        </IssueContext.Provider>
    );
}

export { IssueContext, IssueContextProvider };