import { createContext, useReducer } from 'react';

const ProjectContext = createContext();

const projectReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROJECTS":
            return {
                projects: action.payload,
            };
        case "CREATE_PROJECT":
            return {
                projects: [action.payload, ...state.projects],
            };
        case "UPDATE_PROJECT":
            return {
                // got error as first render is null so added a check
                projects: state.projects && state.projects.map((project) =>
                    project._id === action.payload._id ? action.payload : project
                ),
            };
        case "SET_SINGLE_PROJECT":
            return {
                singleProject: action.payload,
            };
        case "GET_SINGLE_PROJECT":
            return {
                singleProject: state.projects && state.projects.find((project) => project._id === action.payload),
            };
        case "DELETE_PROJECT":
            return {
                projects: state.projects && state.projects.filter((project) => project._id !== action.payload),
            };            
        default:
            return state;
    }
}

const ProjectContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(projectReducer, {
        projects: null,
    });

    return (
        <ProjectContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProjectContext.Provider>
    );
}   

export { ProjectContext, ProjectContextProvider };