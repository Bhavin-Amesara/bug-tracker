import { FetchProjects } from "./handleCreateIssue";
import React, { useState } from "react";
import { useIssueContext } from "../../hooks/useIssueContext";
import { useAuthContext } from "../../hooks/useAuthContext";
const Swal = require("sweetalert2");
const withReactContent = require("sweetalert2-react-content");
const mySwal = withReactContent(Swal);

const CreateIssue = ({ userDetails }) => {
    // context
    const { dispatch } = useIssueContext();
    const { user } = useAuthContext();
    const userId = user && user.isLoggedIn ? user.userId : "";
    const userEmail = user && user.email;
    
    // work on this function
    const [projects, setProjects] = useState([]);

    FetchProjects(userDetails, setProjects);
    const [issueTitle, setIssueTitle] = useState("Issue 2");
    const [issueDescription, setIssueDescription] = useState("This is a test issue 2");
    const [issueProjectID, setIssueProjectID] = useState("");
    const [issueCreatedBy, setIssueCreatedBy] = useState(userId);
    const [issueStatus, setIssueStatus] = useState("open");
    const [issuePriority, setIssuePriority] = useState("minor");
    const [issueVisibility, setIssueVisibility] = useState("public");
    const [issueFeature, setIssueFeature] = useState("bug");
    const [issueDueDate, setIssueDueDate] = useState("2024-07-31");
    const [issueFile, setIssueFile] = useState("");

    const HandleCreateIssue = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", issueTitle);
        formData.append("description", issueDescription);
        formData.append("project_id", issueProjectID);
        formData.append("created_by", issueCreatedBy);
        formData.append("status", issueStatus);
        formData.append("priority", issuePriority);
        formData.append("visibility", issueVisibility);
        formData.append("feature", issueFeature);
        formData.append("due_date", issueDueDate);
        for (let i = 0; i < issueFile.length; i++) {
            formData.append("file", issueFile[i]);
        }

        console.log(...formData, "from create issue form");
        fetch('http://localhost:3300/api/issues', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.status === true) {
                console.log(data, "from create issue form");
                dispatch({ type: "CREATE_ISSUE", payload: data.data });
                mySwal.fire({
                    title: "Issue created",
                    text: "Issue has been created successfully",
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            } else {
                mySwal.fire({
                    title: "Issue not created",
                    html: `<div class="error-msg">${data.message}</div>`,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        });

    };
    // handle due date to be greater than today
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="issueForm">
        <div className="formBody">
            <div className="formHeader">
                <div className="formTitle dashboard-title">Create Issue</div>
            </div>
            <div className="formContent">
                <form method="POST" onSubmit={HandleCreateIssue} className="formFields d-flex-column" encType="multipart/form-data">
                    <div className="formFields">
                        {/* check css for form-group class in app.scss file */}
                        <div className="form-group"> 
                            <label htmlFor="created_by">Created By</label>
                            <input type="text" name="created_by" id="created_by" value={userEmail} readOnly/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" id="title" required placeholder="Enter the title of the issue" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" required placeholder="Enter the description of the issue" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="project_id">Project</label>
                            <select name="project_id" id="project_id" required onChange={(e) => setIssueProjectID(e.target.value)}>
                                <option value="">Select a project</option>
                                {projects.map((project) => 
                                    (<option key={project._id} value={project._id}>{project.title}</option>
                                ))}
                            </select>           
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select name="priority" id="priority" required onChange={(e) => setIssuePriority(e.target.value)}>
                                <option value="minor">Minor</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                                <option value="blocker">Blocker</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="due_date">Due Date</label>
                            <input type="date" name="due_date" id="due_date" required min={today} onChange={(e) => setIssueDueDate(e.target.value)} 
                            value={issueDueDate} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select name="status" id="status" required onChange={(e) => setIssueStatus(e.target.value)}>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="visibility">Visibility</label>
                            <select name="visibility" id="visibility" required onChange={(e) => setIssueVisibility(e.target.value)}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="feature">Feature</label>
                            <select name="feature" id="feature" required onChange={(e) => setIssueFeature(e.target.value)}>
                                <option value="bug">Bug</option>
                                <option value="defect">Defect</option>
                                <option value="enhancement">Enhancement</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">Attach File</label>
                            <input type="file" name="file" id="file" multiple onChange={(e) => setIssueFile(e.target.files)} />
                        </div> 
                        <div className="form-group">
                            <button type="submit" className="btn-button">Create Issue</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
}

export default CreateIssue;