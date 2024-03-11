import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIssueContext } from '../../hooks/useIssueContext';
import './Issues.scss';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useIssueTrackerContext } from '../../hooks/useIssueTrackerContext';
// react toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SingleIssueEdit = () => {
    // sweetalert
    const mySwal = withReactContent(Swal);
    // useNavigate
    const navigate = useNavigate();
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
    var tempId = useParams().id;
    tempId = tempId.toString();
    const [issueId, setIssueId] = useState(tempId);

    useEffect(() => {
        setIssueId(tempId);
        console.log(issueId, "from single issue view");
    }, []);

    // first time loading issue data based on issue ID
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + issueId)
        .then((response) => response.json())
        .then((response) => {
            if(response.status === false){
                mySwal.fire({
                    title: response.message,
                    text: "Issue might be deleted",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {
                    navigate("/issues");
                });
            }
            // use date-fns to format date
            response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
            response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
            
            dispatch({ type: "SET_SINGLE_ISSUE", payload: response.data });
            setStatus(response.data.status);
            setPriority(response.data.priority);
            setDescription(response.data.description);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [dispatch]);
    
    // handle form change [updating issue data using issue ID]
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
        fetch("http://localhost:3300/api/issues/" + issueId, {
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
            toast.success('Issue updated successfully');
            response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
            response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
            dispatch({ type: "UPDATE_ISSUE", payload: response.data });
            dispatch({ type: "SET_SINGLE_ISSUE", payload: response.data });
            console.log(response, "from single issue view");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // handle issue delete
    const handleIssueDelete = () => {
        // alert using sweetalert
        mySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://localhost:3300/api/issues/" + issueId, {
                    method: "DELETE",
                })
                .then((response) => response.json())
                .then((response) => {
                    if(response.status){
                        mySwal.fire({
                            title: "Issue Deleted successful",
                            icon: "success",
                            confirmButtonText: "Ok",
                        }).then(() => {
                            navigate("/issues");
                        });
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                    mySwal.fire({
                        title: "Issue not deleted",
                        text: "Try Again",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                });
            }
        });

        dispatch({ type: "DELETE_ISSUE", payload: issueId });
    }
    return (
        <>
        <ToastContainer />
        <div className="singleIssueEdit ">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Issue Details</div>
            </div>
            <div className="issueDetails">
                <div className="issueActualContent">
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
                </div>
                <div className="issueEditContent">
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
                    <div className="issueDetailsItemDesc d-flex">
                        <textarea className="issueDetailsValue" name="description" id="description" disabled={!editDescription} onChange={(e) => setDescription(e.target.value)} value={desc}>
                        </textarea>
                        <span className={editDescription?"material-symbols-outlined active":"material-symbols-outlined"}
                        onClick={() => setEditDescription(!editDescription)}>edit</span>
                    </div>
                    <div className="issueDetailsItem">
                        <div className="issueActions">
                            <button className="btn-button save" type="submit" onClick={handleFormChange}>Save</button>
                            <button className="btn-button delete" type="button" onClick={handleIssueDelete}>Delete</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default SingleIssueEdit;