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
        case "UPDATE_ISSUE":
            return {
                // got error as first render is null so added a check
                issues: state.issues && state.issues.map((issue) =>
                    issue._id === action.payload._id ? action.payload : issue
                ),
            };
        case "SET_SINGLE_ISSUE":
            return {
                singleIssue: action.payload,
            };
        case "GET_SINGLE_ISSUE":
            return {
                singleIssue: state.issues && state.issues.find((issue) => issue._id === action.payload),
            };
        case "DELETE_ISSUE":
            return {
                issues: state.issues && state.issues.filter((issue) => issue._id !== action.payload),
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