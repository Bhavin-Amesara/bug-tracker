import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProjectContext } from "../../hooks/useProjectContext";
import { formatDistanceToNow } from "date-fns";
import AssignUserToProject from "./AssignUserToProject";
import { toast } from 'react-toastify';
import $ from 'jquery';

const SingleProjectActions = () => {
    // context
    const { user } = useAuthContext();
    const { singleProject:project, dispatch } = useProjectContext();

    const { id } = useParams();

    const [projectUsers, setProjectUsers] = useState([]);
    const [issueCreatedByUserForProject, setIssueCreatedByUserForProject] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3300/api/projects/users/' + id)
        .then((res) => res.json())
        .then((data) => {
            setProjectUsers(data.data);
        });
    }, [id]);

    if (projectUsers) {
        $('#projectAssignedToUserIssueTable').DataTable({
            data: issueCreatedByUserForProject,
            columns: [
                { data: "title", title: "Title" },
                { data: "description", title: "Description" },
                { data: "createdAt", title: "Created At" },
                { data: "createdAt", title: "Updated At" },
            ],
            "bDestroy": true,
            "bAutoWidth": false,
        });
    }

    const showIssueCreatedByUser = (userId) => {
        fetch(`http://localhost:3300/api/projects/${id}/issues/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.data[0], "single project actions");
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

    return (
        <>
        { user.role === "admin" || user.role === 'manager' ?
                <AssignUserToProject projectName={project && project.title} /> : 
                <div className="inner-container assignUserToProject"><h3>You are not authorized to assign a project</h3></div>
            }
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
            : null }</>
    );
};

export default SingleProjectActions;