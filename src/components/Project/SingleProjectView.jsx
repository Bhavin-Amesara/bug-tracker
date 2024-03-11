import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";


const SingleProjectView = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [projectIssues, setProjectIssues] = useState([]);
    const [projectIssuesTracker, setProjectIssuesTracker] = useState([{}]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('http://localhost:3300/api/projects/' + id) 
        .then((res) => res.json())
        .then((data) => {
            if (data.status === false) {
                navigate('/projects');
            }
            console.log(data);
            data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });
            data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });
            setProject(data.data);
        });

        fetch('http://localhost:3300/api/issues/project/' + id)
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "issues");
            setProjectIssues(data.data);
        });

        fetch('http://localhost:3300/api/issue-tracker/project/' + id)
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "issuestracker");
            setProjectIssuesTracker(data.data);
        });

    }, [id]);
    
    return (
        <>
            <div className="container">
                <div className="projectHeader">
                    <div className="backButton">
                        <Link to="/projects"> 
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> Back </Link>
                    </div>
                    <div className='projectMenu'>
                    </div>
                </div>
            <ToastContainer />
            <div className="singleProjectView container d-flex d-flex-column">
                <div className="singleProjectDetails">
                    <div className="singleProjectContent">
                        <h1>Project: {project && project.title}</h1>
                        <p>Description: {project && project.description}</p>
                        <p>Created by: {project && project.created_by.username}</p>
                        <p>Lead: {project && project.lead.username}</p>
                        <p>Visibility: {project && project.visibility}</p>
                        <p>Department: {project && project.department}</p>
                        <p>Created at: {project && project.createdAt}</p>
                        <p>Updated at: {project && project.updatedAt}</p>
                        <p>Status: {project && project.status}</p>
                    </div>
                    <div className="singleProjectAnalytics">
                        <h1>Analytics</h1>
                        <p>Number of issues: { projectIssues.length }</p>
                        <p>Number of user (working on): { projectIssuesTracker.length }</p>
                    </div>
                </div>
                
            </div>
            </div>
        </>
    );
    }

export default SingleProjectView;