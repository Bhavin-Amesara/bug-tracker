import { createContext, useReducer } from "react";

const CommentContext = createContext();

const commentReducer = (state, action) => {
    switch (action.type) {
        case "SET_COMMENTS":
            return {
                comments: action.payload,
            };
        case "CREATE_COMMENT":
            return {
                comments: [action.payload, ...state.comments],
            };
        case "UPDATE_COMMENT":
            return {
                comments: state.comments && state.comments.map((comment) =>
                    comment._id === action.payload._id ? action.payload : comment
                ),
            };
        case "DELETE_COMMENT":
            return {
                comments: state.comments && state.comments.filter((comment) => comment._id !== action.payload),
            };
        case "CREATE_COMMENT_REPLY":
            return {
                comments: state.comments && state.comments.map((comment) =>
                    comment._id === action.payload.parentId ? { ...comment, replies: [action.payload, ...comment.replies] } : comment
                ),
            };
        case "UPDATE_COMMENT_REPLY":
            return {
                comments: state.comments && state.comments.map((comment) =>
                    comment._id === action.payload.parentId ? { ...comment, replies: comment.replies.map((reply) => reply._id === action.payload._id ? action.payload : reply) } : comment
                ),
            };
        case "DELETE_COMMENT_REPLY":
            return {
                comments: state.comments && state.comments.map((comment) =>
                    comment._id === action.payload.parentId ? { ...comment, replies: comment.replies.filter((reply) => reply._id !== action.payload._id) } : comment
                ),
            };
            
        default:
            return state;
    }
}

const CommentContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(commentReducer, { comments: [] });

    return (
        <CommentContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CommentContext.Provider>
    );
}

export { CommentContext, CommentContextProvider };