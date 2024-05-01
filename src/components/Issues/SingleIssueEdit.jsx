import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIssueContext } from '../../hooks/useIssueContext';
import './Issues.scss';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
    }, [tempId]);

    // first time loading issue data based on issue ID
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + issueId)
        .then((response) => response.json())
        .then((response) => {
            if(response.status === false){
                mySwal.fire({
                    title: response.message,
                    text: "Single issue might be deleted",
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
    }, [dispatch, issueId]);
    
    // handle form change [updating issue data using issue ID]
    const handleFormUpdate = (e) => {
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
            if(response.status === false){
                toast.error(response.message);
                return;
            }
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
    const handleFormDelete = () => {
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
                    console.log(response);
                    if(response.statusCode === 200){
                        mySwal.fire({
                            title: "Single Issue Deleted successful",
                            icon: "success",
                            confirmButtonText: "Ok",
                        }).then(() => {
                            navigate("/issues");
                        });
                    } else {
                        mySwal.fire({
                            title: "Single Issue not deleted",
                            text: "Try Again",
                            icon: "error",
                            confirmButtonText: "Ok",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                    mySwal.fire({
                        title: "Single Issue not deleted",
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
        <div className="singleCommonEdit ">
            <div className="commonEditHeader">
                <div className="table-title dashboard-title">Edit Issue Details</div>
            </div>
            <div className="commonEditDetails">
                <div className="commonEditActualContent">
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Title</div>
                    <div className="commonEditDetailsValue">{singleIssue?.title}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Project</div>
                    <div className="commonEditDetailsValue">{singleIssue?.project_id?.title}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Created By</div>
                    <div className="commonEditDetailsValue">{singleIssue?.created_by?.username}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Updated At</div>
                    <div className="commonEditDetailsValue">{singleIssue?.updatedAt}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Created At</div>
                    <div className="commonEditDetailsValue">{singleIssue?.createdAt}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Updated By</div>
                    <div className="commonEditDetailsValue">{singleIssue?.last_updated_by?.username}</div>
                </div>
                </div>
                <div className="commonEditEditContent">
                <form className="commonEditDetailsForm">
                    <div className="commonEditDetailsItem">
                        <div className="commonEditDetailsLabel">Status</div>
                        <div className="commonEditControls d-flex" >
                            {user && user.role==="manager" | user.role==="admin" | user.userId === singleIssue?.created_by?._id ?
                            <>
                                <select className="commonEditDetailsValue" name="status" id="status" value={status} disabled={!editStatus} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <span className={editStatus?"material-symbols-outlined active":"material-symbols-outlined"}
                                onClick={() => setEditStatus(!editStatus)}>edit</span>
                            </>
                                : 
                            <>
                                <div className="commonEditDetailsValue light-color">{singleIssue?.status}</div>
                            </>
                            }
                        </div>
                    </div>
                    <div className="commonEditDetailsItem">
                        <div className="commonEditDetailsLabel">Priority</div>
                        <div className="commonEditControls d-flex">
                        {user && user.role==="manager" | user.role==="admin" | user.userId === singleIssue?.created_by?._id ?
                        <>
                            <select className="commonEditDetailsValue" name="priority" id="priority" value={priority} disabled={!editPriority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="minor">Minor</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                                <option value="blocker">Blocker</option>
                            </select>
                            <span className={editPriority?"material-symbols-outlined active":"material-symbols-outlined"}
                            onClick={() => setEditPriority(!editPriority)}>edit</span>
                        </>
                            : <div className="commonEditDetailsValue light-color">{singleIssue?.priority}</div>
                        }
                        </div>
                    </div>
                    <div className="commonEditDetailsItemDesc d-flex">
                        {user && user.role==="manager" | user.role==="admin" | user.userId === singleIssue?.created_by?._id ?
                        <>
                        <textarea className="commonEditDetailsValue" name="description" id="description" disabled={!editDescription} onChange={(e) => setDescription(e.target.value)} value={desc}>
                        </textarea>
                        <span className={editDescription?"material-symbols-outlined active":"material-symbols-outlined"}
                        onClick={() => setEditDescription(!editDescription)}>edit</span>
                        </>
                            : <div className="commonEditDetailsValue light-color">{singleIssue?.description}</div>
                        }
                    </div>
                    <div className="commonEditDetailsItem">
                        {user && user.role==="manager" | user.role==="admin" | user.userId === singleIssue?.created_by?._id ?
                            <div className="commonEditActions">
                                <button className="btn-button save" type="submit" onClick={handleFormUpdate}>Update</button>
                                <button className="btn-button delete" type="button" onClick={handleFormDelete}>Delete</button>
                            </div>
                            : <p className='warning2 fs-normal-important d-flex'><span className="material-symbols-outlined mr-10">info</span> Only the creator of the issue can update the issue</p>
                        }
                    </div>
                </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default SingleIssueEdit;