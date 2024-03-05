import { createContext, useReducer } from 'react';

const IssueTrackerContext = createContext();

const issueTrackerReducer = (state, action) => {
    switch (action.type) {
        case "SET_ISSUES_TRACKER":
            return {
                issuesTracker: action.payload,
            };
        case "CREATE_ISSUE_TRACKER":
            return {
                issuesTracker: state.issuesTracker && [action.payload, ...state.issuesTracker],
            };
        case "UPDATE_ISSUE_TRACKER":
            return {
                issuesTracker: state.issuesTracker && state.issuesTracker.map((issueTracker) =>
                issueTracker._id === action.payload._id ? action.payload : issueTracker
                ),
            };
        case "DELETE_ISSUE_TRACKER":
            return {
                issuesTracker: state.issuesTracker && state.issuesTracker.filter((issueTracker) => issueTracker._id !== action.payload),
            };
        default:
            return state;
    }
}

const IssueTrackerContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(issueTrackerReducer, {
        issuesTracker: null,
    });

    return (
        <IssueTrackerContext.Provider value={{ ...state, dispatch }}>
            {children}
        </IssueTrackerContext.Provider>
    );
}

export { IssueTrackerContext, IssueTrackerContextProvider };