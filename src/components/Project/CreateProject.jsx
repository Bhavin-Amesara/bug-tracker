import React, { useState, useEffect } from "react";
import "./Project.scss";
import { useProjectContext } from "../../hooks/useProjectContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Swal = require("sweetalert2");
const withReactContent = require("sweetalert2-react-content");
const mySwal = withReactContent(Swal);

const Project = () => {
    // context
    const { dispatch } = useProjectContext();
    const { user } = useAuthContext();
    const userId = user && user.isLoggedIn ? user.userId : "";
    const userEmail = user && user.email;
    // navigate
    const navigate = useNavigate();

    // state
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectCreatedBy] = useState(userId);
    const [projectLead, setProjectLead] = useState();
    // const [projectVisibility, setProjectVisibility] = useState("private");
    const [projectDepartment, setProjectDepartment] = useState("");
    const [leadUsers, setLeadUsers] = useState([{}]);

    useEffect(() => {
        fetch('http://localhost:3300/api/users/role/manager')
        .then((response) => response.json())
        .then((response) => {
            if (response.status === true && (response.statusCode === 200) || (response.statusCode === 201)) {
                setLeadUsers(response.data);
            } else {
                console.log(response);
                if (response.message !== "") {
                    toast.error(response.message);
                } else if (response.extraDetails && response.extraDetails.message) {
                    toast.error(response.extraDetails.message);
                }else if (response.extraDetails ) {
                    toast.error(response.extraDetails);
                }
            }
        });
    }, []);

    const HandleCreateProject = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", projectTitle);
        formData.append("description", projectDescription);
        formData.append("created_by", projectCreatedBy);
        formData.append("lead", projectLead);
        // formData.append("visibility", projectVisibility);
        formData.append("department", projectDepartment);

        fetch('http://localhost:3300/api/projects', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === true && (response.statusCode === 200) || (response.statusCode === 201)) {
                dispatch({ type: "CREATE_PROJECT", payload: response.data });
                mySwal.fire({
                    title: "Project created",
                    text: "Project has been created successfully",
                    icon: "success",
                }).then(() => {
                    navigate("/project/" + response.data._id);
                });
            } else {
                console.log(response);
                if (response.message !== "") {
                    toast.error(response.message);
                } else if (response.extraDetails & response.extraDetails.message) {
                    toast.error(response.extraDetails.message);
                }else if (response.extraDetails ) {
                    toast.error(response.extraDetails);
                }
            }
        });
    }

    return (
        <div className="projectForm">
            <ToastContainer />
            <div className="formBody">
            <div className="formHeader">
                <div className="formTitle dashboard-title">Create Project</div>
            </div>
            <div className="formContent">
                <form onSubmit={HandleCreateProject}>
                    <div className="formFields">
                    {/* check css for form-group class in app.scss file */}
                    <div className="form-group">
                        <label htmlFor="created_by">Created By</label>
                        <input
                            type="text"
                            className="form-control"
                            id="created_by"
                            name="created_by"
                            value={userEmail}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            placeholder="Enter project title"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            placeholder="Enter project description"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lead">Lead By</label>
                        <select className="form-control" id="lead" value={projectLead} onChange={(e) => setProjectLead(e.target.value)} name="lead">
                            {leadUsers.map((user) => (
                                <option key={user._id} value={user._id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="visibility">Visibility</label>
                        <select className="form-control" id="visibility" value={projectVisibility} onChange={(e) => setProjectVisibility(e.target.value)} name="visibility">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select className="form-control" id="department" value={projectDepartment} onChange={(e) => setProjectDepartment(e.target.value)} name="department">
                            <option value="general">General</option>
                            <option value="UI">UI</option>
                            <option value="backend">Backend</option>
                            <option value="database">Database</option>
                            <option value="testing">Testing</option>
                            <option value="security">Security</option>
                        </select>
                    </div>
                        <button type="submit" className="btn-button">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default Project;