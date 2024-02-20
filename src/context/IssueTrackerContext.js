import { createContext, useReducer } from 'react';

const IssueTrackerContext = createContext();

const issueTrackerReducer = (state, action) => {
    switch (action.type) {
        case "SET_ISSUES_TRACKER":
            return {
                issues: action.payload,
            };
        case "CREATE_ISSUE_TRACKER":
            return {
                issues: [action.payload, ...state.issues],
            };
        case "UPDATE_ISSUE_TRACKER":
            return {
                issues: state.issues.map((issue) =>
                    issue._id === action.payload._id ? action.payload : issue
                ),
            };
        case "DELETE_ISSUE_TRACKER":
            return {
                issues: state.issues.filter((issue) => issue._id !== action.payload),
            };
        default:
            return state;
    }
}

const IssueTrackerContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(issueTrackerReducer, {
        issues: null,
    });

    return (
        <IssueTrackerContext.Provider value={{ ...state, dispatch }}>
            {children}
        </IssueTrackerContext.Provider>
    );
}

export { IssueTrackerContext, IssueTrackerContextProvider };