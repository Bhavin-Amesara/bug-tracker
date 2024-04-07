import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import AssignUserToProject from "./AssignUserToProject";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProjectContext } from "../../hooks/useProjectContext";
import DataTable from 'datatables.net';
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery';
import SingleProjectEdit from "./SingleProjectEdit";

const SingleProjectView = ({ activeSingleProjectLink }) => {
    // context
    const { user } = useAuthContext();
    const { singleProject:project, dispatch } = useProjectContext();

    const { id } = useParams();
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
            dispatch({ type: "SET_SINGLE_PROJECT", payload: data.data });
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
                toast.error(data.message);
                return;
            } 
            if (data.data.length === 0) {
                setIssueCreatedByUserForProject(null);
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

    useEffect(() => {
        if (issueCreatedByUserForProject) {
            $('#projectAssignedToUserIssueTable').DataTable({
                data: issueCreatedByUserForProject,
                columns: [
                    { data: "title", title: "Title" },
                    { data: "description", title: "Description" },
                    { data: "createdAt", title: "Created At" },
                    { data: "updatedAt", title: "Updated At" },
                ],
                "bDestroy": true,
                "bAutoWidth": false,
            });
        }
    }, [issueCreatedByUserForProject]);

    
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
                        <h1>Project: <span>{project && project.title}</span></h1>
                        <p>Description: <span>{project && project.description}</span></p>
                        <p>Created by: <span>{project && project.created_by.username}</span></p>
                        <p>Lead: <span>{project && project.lead.username}</span></p>
                        <p>Status: <span>{project && project.status}</span></p>
                        <p>Visibility: <span>{project && project.visibility}</span></p>
                        <p>Department: <span>{project && project.department}</span></p>
                        <p>Created at: <span>{project && project.createdAt}</span></p>
                        <p>Updated at: <span>{project && project.updatedAt}</span></p>
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
            : activeSingleProjectLink === 'editSingleProject' ? 
                <>{ user.role === "admin" || user.role === 'manager'? <SingleProjectEdit /> : <div className="inner-container assignUserToProject"><h3>You are not authorized to create a project</h3></div>}</>
            : activeSingleProjectLink === 'addUserToProject' ? 
                <>
                    { user.role === "admin" || user.role === 'manager' ?
                        <AssignUserToProject projectName={project && project.title} /> : 
                        <div className="inner-container assignUserToProject"><h3>You are not authorized to assign a project</h3></div>
                    }
                    {/* display user related to this project */}
                    <div className="inner-container viewProjectUsers d-flex">
                        <div className="table-title dashboard-title"> Project Users </div>
                        {
                            projectUsers && projectUsers.length > 0 ?
                            projectUsers.map(user => {
                                return (
                                    <button className="btn btn-button" key={user.id} onClick={() => showIssueCreatedByUser(user.userId._id) }> {user.userId.username} </button>
                                )
                            }) : "This project not assigned to Users"
                        }
                    </div>
                    { projectUsers && projectUsers.length > 0 ? 
                    <div className="inner-container">
                        <div className="issueDetailsForProjects">
                            <div className="table-title dashboard-title">Issues</div>
                            <div className="issueDetailsContent">
                                <table className="table" id="projectAssignedToUserIssueTable">
                                </table>
                            </div>
                        </div>
                    </div>
                    : null }
                    
                </>
            : null }
                
            </div>
            </div>
        </>
    );
    }

export default SingleProjectView;