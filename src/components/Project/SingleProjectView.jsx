import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";


const SingleProjectView = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('http://localhost:3300/api/projects/' + id) 
        .then((res) => res.json())
        .then((data) => {
            setProject(data.data);
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
            <div className="singleProjectView container">
                <h1>Project: {project && project.title}</h1>
                <p>Description: {project && project.description}</p>
                <p>Created by: {project && project.created_by}</p>
                <p>Lead: {project && project.lead}</p>
                <p>Visibility: {project && project.visibility}</p>
                <p>Department: {project && project.department}</p>
                <p>Created at: {project && project.createdAt}</p>
                <p>Updated at: {project && project.updatedAt}</p>
                <p>Status: {project && project.status}</p>
            </div>
            </div>
        </>
    );
    }

export default SingleProjectView;