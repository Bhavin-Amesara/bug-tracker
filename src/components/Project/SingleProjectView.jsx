import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
// import { Chart, Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import AssignUserToProject from "./AssignUserToProject";
import { useAuthContext } from "../../hooks/useAuthContext";

const SingleProjectView = ({ activeSingleProjectLink }) => {
    // context
    const { user } = useAuthContext();

    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [projectIssues, setProjectIssues] = useState([]);
    const [projectIssuesTracker, setProjectIssuesTracker] = useState([{}]);
    const [projectUsers, setProjectUsers] = useState([]);
    const navigate = useNavigate();
    const [issueCreatedByUserForProject, setIssueCreatedByUserForProject] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3300/api/projects/' + id) 
        .then((res) => res.json())
        .then((data) => {
            if (data.status === false) {
                navigate('/projects');
            }
            data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });
            data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });
            setProject(data.data);
        });

        fetch('http://localhost:3300/api/issues/project/' + id)
        .then((res) => res.json())
        .then((data) => {
            setProjectIssues(data.data);
        });

        fetch('http://localhost:3300/api/issue-tracker/project/' + id)
        .then((res) => res.json())
        .then((data) => {
            setProjectIssuesTracker(data.data);
        });

        fetch('http://localhost:3300/api/projects/users/' + id)
        .then((res) => res.json())
        .then((data) => {
            setProjectUsers(data.data);
        });
        
    }, [id]);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Issues',
            data: [projectIssues.length, 19, 3, 5, 2, 3, 4],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Issue Tracker',
            data: [projectIssuesTracker.length, 19, 8, 5, -2, 3, 4.5],
            fill: false,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgba(54, 162, 235, 0.2)',
          },
        ],
    };

    const showIssueCreatedByUser = (userId) => {
        fetch(`http://localhost:3300/api/projects/${id}/issues/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === false) {
                setIssueCreatedByUserForProject(null);
                return;
            } 
            if (data.data.length === 0) {
                setIssueCreatedByUserForProject(null);
                return;
            }
            data.data.forEach(issue => {
                issue.createdAt = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true });
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });
            setIssueCreatedByUserForProject(data.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }


    
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
            <div className="singleProjectView inner-container d-flex d-flex-column">
            { activeSingleProjectLink === 'singleProjectDetails' ? 
            <><div className="table-title dashboard-title">Project Details</div> 
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
                        <div className="chart">
                            <Line data={data} />
                        </div>  
                    </div>
                </div></>
            : activeSingleProjectLink === 'editSingleProject' ? <div className="table-title dashboard-title">Edit Project</div> 
            : activeSingleProjectLink === 'addUserToProject' ? 
                <>
                    <AssignUserToProject projectName={project && project.title} />
                    {/* display user related to this project */}
                    <div className="inner-container viewProjectUsers d-flex">
                        <div className="table-title dashboard-title"> Project Users </div>
                        {
                            projectUsers.map(user => {
                                return (
                                    <div className="projectUser" key={user.id}>
                                        {/* <div className="projectUserDetails"> */}
                                            <button className="btn btn-button" onClick={() => showIssueCreatedByUser(user.userId._id) }> {user.userId.username} </button>
                                        {/* </div> */}
                                    </div>
                                )
                            })
                        }
                        </div>
                    <div className="inner-container">
                        <div className="issueDetailsForProjects">
                            <div className="table-title dashboard-title">Issues</div>
                            <div className="issueDetailsContent">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { issueCreatedByUserForProject ? issueCreatedByUserForProject.map(issue => {
                                            return (
                                                <tr key={issue._id}>
                                                    <td>{issue.title}</td>
                                                    <td>{issue.priority}</td>
                                                    <td>{issue.status}</td>
                                                    <td>{issue.createdAt}</td>
                                                    <td>{issue.updatedAt}</td>
                                                </tr>
                                            )
                                        }) : 
                                        <tr>
                                            <td colSpan="5">No issues found for this user</td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </>
            : null }
                
            </div>
            </div>
        </>
    );
    }

export default SingleProjectView;