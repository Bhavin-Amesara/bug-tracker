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
        case "SET_ISSUE_STATUS":
            return {
                issues: state.issues && state.issues.map((issue) =>
                    issue._id === action.payload._id ? { ...issue, status: action.payload.status } : issue
                ),
            };
        case "SET_ISSUE_COMMENTS":
            return {
                singleIssueComments: action.payload,
            };
        case "CREATE_ISSUE_COMMENT":
            return {
                singleIssueComments: [action.payload, ...state.singleIssueComments],
            };
        case "DELETE_ISSUE_COMMENT":
            return {
                singleIssueComments: state.singleIssueComments.filter((comment) => comment._id !== action.payload),
            };
        case "UPDATE_ISSUE_COMMENT":
            return {
                singleIssueComments: state.singleIssueComments.map((comment) =>
                    comment._id === action.payload._id ? action.payload : comment
                ),
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