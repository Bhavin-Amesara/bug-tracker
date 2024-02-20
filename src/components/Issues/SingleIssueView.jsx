import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useIssueContext } from "../../hooks/useIssueContext";
import "./Issues.scss";
import { formatDistanceToNow } from "date-fns";
import DataTable from 'datatables.net';
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

const SingleIssueView = () => {
    // toogle state
    const [editStatus, setEditStatus] = useState(false);
    const [editPriority, setEditPriority] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    // context
    const { dispatch, singleIssue } = useIssueContext();
    const { user } = useAuthContext();

    // change content 
    const [status, setStatus] = useState(singleIssue?.status);
    const [priority, setPriority] = useState(singleIssue?.priority);
    const [desc, setDescription] = useState(singleIssue?.description);

    // fetch issue id from url
    var id = useParams().id;
    id = id.toString();


    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + id)
        .then((response) => response.json())
        .then((response) => {
            // use date-fns to format date
            response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
            response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
            
            dispatch({ type: "SET_SINGLE_ISSUE", payload: response.data });
            setStatus(response.data.status);
            setPriority(response.data.priority);
            setDescription(response.data.description);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [dispatch, id]);
    
    // handle form change
    const handleFormChange = (e) => {
        e.preventDefault();
        // update state
        setStatus(document.getElementById("status").value);
        setPriority(document.getElementById("priority").value);
        setDescription(document.getElementById("description").value);
        console.log(status, priority, desc);
        // get user id
        const userId = user?.userId;
        // update issue
        fetch("http://localhost:3300/api/issues/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
                priority: priority,
                description: desc,
                last_updated_by: userId,
            }),
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            dispatch({ type: "UPDATE_ISSUE", payload: response.data });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // handle issue delete
    const handleIssueDelete = () => {
        dispatch({ type: "DELETE_ISSUE", payload: id });
    }

    // fetch issue tracker
    const [issueTrackerMessage, setIssueTrackerMessage] = useState("");
    useEffect(() => {
        fetch("http://localhost:3300/api/issue-tracker/" + id)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            // use date-fns to format date
            response.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });
            if ( response.data.length === 0 ) {
                setIssueTrackerMessage(response.message || "No issue tracker found.");
                return;
            }
            $('#issuesTable').DataTable({
                data: response.data,
                columns: [
                    { title: "Assigned To", data: "assigned_to.username" },
                    { title: "Status", data: "status" },
                    { title: "Updated At", data: "updatedAt" },
                ]
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }, [id]);


    return (
        <>
        <div className="container">
            <div className="backButton">
                <Link to="/issues" className="material-symbols-outlined">arrow_back<span>Back</span></Link> 
            </div>
        </div>
        <div className="singleIssueView container">
            <div className="singleIssueViews">
                <div className="issueHeader">
                    <div className="table-title dashboard-title">Issue Details</div>
                </div>
                <div className="issueDetails d-flex-column">
                    <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Title</div>
                        <div className="issueDetailsValue">{singleIssue?.title}</div>
                    </div>
                    <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Project</div>
                        <div className="issueDetailsValue">{singleIssue?.project_id?.title}</div>
                    </div>
                    <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Created By</div>
                        <div className="issueDetailsValue">{singleIssue?.created_by?.username}</div>
                    </div>
                    <form className="issueDetailsForm">
                        <div className="issueDetailsItem">
                            <div className="issueDetailsLabel">Status</div>
                            <div className="issueControls d-flex" >
                                <select className="issueDetailsValue" name="status" id="status" value={status} disabled={!editStatus} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                    <span className={editStatus?"material-symbols-outlined active":"material-symbols-outlined"}
                                     onClick={() => setEditStatus(!editStatus)}>edit</span>
                            </div>
                        </div>
                        <div className="issueDetailsItem">
                            <div className="issueDetailsLabel">Priority</div>
                            <div className="issueControls d-flex">
                                <select className="issueDetailsValue" name="priority" id="priority" value={priority} disabled={!editPriority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="minor">Minor</option>
                                    <option value="major">Major</option>
                                    <option value="critical">Critical</option>
                                    <option value="blocker">Blocker</option>
                                </select>
                                <span className={editPriority?"material-symbols-outlined active":"material-symbols-outlined"}
                                 onClick={() => setEditPriority(!editPriority)}>edit</span>
                            </div>
                        </div>
                        <div className="issueDetailsItem  d-flex">
                            {/* <h2>Description</h2> */}
                            <textarea className="issueDetailsValue" name="description" id="description" disabled={!editDescription} onChange={(e) => setDescription(e.target.value)} value={desc}>
                            </textarea>
                            <span className={editDescription?"material-symbols-outlined active":"material-symbols-outlined"}
                             onClick={() => setEditDescription(!editDescription)}>edit</span>
                        </div>
                        <div className="issueDetailsItem">
                            <div className="issueDetailsLabel">Updated At</div>
                            <div className="issueDetailsValue">{singleIssue?.updatedAt}</div>
                        </div>
                        <div className="issueDetailsItem">
                            <div className="issueDetailsLabel">Created At</div>
                            <div className="issueDetailsValue">{singleIssue?.createdAt}</div>
                        </div>
                        <div className="issueDetailsItem">
                            <div className="issueDetailsLabel">Updated By</div>
                            <div className="issueDetailsValue">{singleIssue?.last_updated_by?singleIssue?.last_updated_by?.username:"Not updated"}</div>
                        </div>
                        <div className="issueDetailsItem">
                            <div className="issueActions">
                                <button className="btn-button save" type="submit" onClick={handleFormChange}>Save</button>
                                <button className="btn-button reset" type="reset" onClick={() => { setEditStatus(false); setEditPriority(false); setEditDescription(false); }}>Cancel</button>
                                <button className="btn-button delete" type="button" onClick={handleIssueDelete}>Delete</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="singleIssueTracker">
                <div className="issueHeader">
                    <div className="table-title dashboard-title">Issue Tracker</div>
                </div>
                <div className="issueTable">
                    <table id="issuesTable" className="display"></table>
                </div>
            </div>
        </div>
        </>
    );
};

export { SingleIssueView };