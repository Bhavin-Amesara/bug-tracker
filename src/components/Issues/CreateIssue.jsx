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
    
    // work on this function
    const [projects, setProjects] = useState([]);

    FetchProjects(userDetails, setProjects);
    
    // handle create issue
    const [issues, setIssue] = useState({
        title: "Issue 2",
        description: "This is a test issue 2",
        project_id: "",
        created_by: userId,
        status: "open",
        priority: "minor",
        visibility: "public",
        feature: "bug",
        due_date: "",
    });

    const HandleCreateIssue = (e) => {
        e.preventDefault();

        fetch("api/issues/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.parse(JSON.stringify(issues))),
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
        <div className="createIssue">
            <div className="createIssueHeader">
                <div className="createIssueTitle dashboard-title">Create Issue</div>
            </div>
            <div className="createIssueContent">
                <form method="POST" onSubmit={HandleCreateIssue}className="createIssueForm d-flex-column" encType="multipart/form-data">
                    <div className="createIssueForm">
                        <div className="createIssueField">
                            <label htmlFor="created_by">Created By</label>
                            <input type="text" name="created_by" id="created_by" value={"nitish@gmail.com"} readOnly onChange={(e) => setIssue({ ...issues, created_by: e.target.value })} />
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" id="title" required placeholder="Enter the title of the issue" onChange={(e) => setIssue({ ...issues, title: e.target.value })} value={issues.title} />
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" required placeholder="Enter the description of the issue" onChange={(e) => setIssue({ ...issues, description: e.target.value })} value={issues.description}></textarea>
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="project_id">Project</label>
                            <select name="project_id" id="project_id" required onChange={(e) => setIssue({ ...issues, project_id: e.target.value })}>
                                {/* <option value="">Select a project</option> */}
                                {projects.map((project) => 
                                    (<option key={project._id} value={project._id}>{project.title}</option>
                                ))}
                            </select>           
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="priority">Priority</label>
                            <select name="priority" id="priority" required onChange={(e) => setIssue({ ...issues, priority: e.target.value })}>
                                <option value="minor">Minor</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                                <option value="blocker">Blocker</option>
                            </select>
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="due_date">Due Date</label>
                            <input type="date" name="due_date" id="due_date" required min={today} onChange={(e) => setIssue({ ...issues, due_date: e.target.value })} 
                            value={issues.due_date} />
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="status">Status</label>
                            <select name="status" id="status" required onChange={(e) => setIssue({ ...issues, status: e.target.value })}>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="visibility">Visibility</label>
                            <select name="visibility" id="visibility" required onChange={(e) => setIssue({ ...issues, visibility: e.target.value })}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <div className="createIssueField">
                            <label htmlFor="feature">Feature</label>
                            <select name="feature" id="feature" required onChange={(e) => setIssue({ ...issues, feature: e.target.value })}>
                                <option value="bug">Bug</option>
                                <option value="defect">Defect</option>
                                <option value="enhancement">Enhancement</option>
                            </select>
                        </div>
                        <div className="createIssueField">
                            <button type="submit" className="createIssueSubmit">Create</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
}

export default CreateIssue;