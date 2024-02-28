import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useIssueContext } from "../../hooks/useIssueContext";
import "./Issues.scss";
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IssueTracker } from "./IssueTracker";
import { useIssueTrackerContext } from "../../hooks/useIssueTrackerContext";

const SingleIssueView = () => {
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

    // context for issue tracker
    const { dispatch: dispatchIssueTracker } = useIssueTrackerContext();

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

    // single issue assign user start
    const userId = user && user.isLoggedIn ? user.userId : "";
    const [assignedBy, setAssignedBy] = useState(userId);
    const [assignTo, setAssignTo] = useState(userId);
    const [assignDescription, setAssignDescription] = useState("");
    const [assignFile, setAssignFile] = useState("");
    const [assignIssueId, setAssignIssueId] = useState(issueId);
    const [assignStatus, setAssignStatus] = useState();
    
    const handleAssigneeChange = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('assignedBy', assignedBy);
        formData.append('assignTo', assignTo);
        formData.append('assignDescription', assignDescription);
        formData.append('assignIssueId', assignIssueId);
        formData.append('assignStatus', assignStatus);
        for (let i = 0; i < assignFile.length; i++) {
            formData.append('assignFile', assignFile[i]);
        }
        console.log(...formData, "from assign user form");
        
        
        fetch('http://localhost:3300/api/issue-tracker', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (!response.data) {
                mySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                });
                return;
            }
            if (response.message === "Internal Server Error"){
                if(response.extraDetails && response.extraDetails.message){
                    mySwal.fire({
                        icon: 'error',
                        title: 'Got some error',
                        text: response.extraDetails.message.split(":")[2],
                    })
                    return;
                }
            }
            // use date-fns to format date
            response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
            console.log(response.data, "from single issue view");
            dispatchIssueTracker({ type: "CREATE_ISSUE_TRACKER", payload: response.data });
            mySwal.fire({
                icon:"success",
                title:"Issue Assign to User Successful",
                text: response.message,
            });
        })
        .catch((error) => {
            console.log(error);
        });

    }

    // handle button 
    const [toggleButtonAssignUser, setToggleButtonAssignUser] = useState(false);
    const handleActive = (props) => {
        if(props === 'assignToUser'){
            setToggleButtonAssignUser(!toggleButtonAssignUser);
            if(toggleButtonAssignUser){
                document.getElementById('assignToUser').classList.remove('active');
            }else{
                document.getElementById('assignToUser').classList.add('active');
            }
        } 
    }
    return (
        <>
            <div className="container">
                <div className="issueHeader">
                    <div className="backButton">
                        <Link to="/issues"> 
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> Back </Link>
                    </div>
                    <div className='issueMenu'>
                        <button id="assignToUser" className="btn-button" onClick={() => {handleActive('assignToUser');}}>Assign to User</button>
                    </div>
                </div>
            </div>
            <div className="singleIssueView container">
                {!toggleButtonAssignUser ?
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
                                {/* <h2>Description2</h2> */}
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
                    :
                    <div className="assignUser">
                        
                        <div className="assignUserContent">
                            <div className=" singleIssueViews issueDetails d-flex-column">
                                <div className="issueHeader">
                                    <div className="table-title dashboard-title">Assign User</div>
                                </div>
                                <form className="issueDetailsForm" encType='multipart/form-data' method='post' id='assignUserForm' name='assignUserForm' >
                                    <div className="issueDetailsItem">
                                        <div className="issueDetailsLabel">Issue</div>
                                        <div className="issueDetailsValue" id="issueTitle">{singleIssue?.title}</div>
                                        {/* <input type="hidden" name="assignIssueId" id="assignIssueId" value={issueId} /> */}
                                    </div>
                                    <div className="issueDetailsItem">
                                        <div className="issueDetailsLabel">Assignee</div>
                                        <div className="issueControls d-flex">
                                            <select className="issueDetailsValue" name="assignTo" id="assignTo" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                                                <option value={singleIssue?.created_by?._id}>{singleIssue?.created_by?.username}</option>
                                                <option value="1">User 1</option>
                                                <option value="2">User 2</option>
                                                <option value="3">User 3</option>
                                                <option value="4">User 4</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="issueDetailsItem">
                                        <div className="issueDetailsLabel">Status</div>
                                        <div className="issueControls d-flex">
                                            <select className="issueDetailsValue" name="assignUserStatus" id="assignUserStatus" value={assignStatus} onChange={(e) => setAssignStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="open">Open</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="issueDetailsItem  d-flex">
                                        <textarea className="issueDetailsValue" name="assignDescription" id="assignDescription" placeholder="Add some comments" onChange={(e) => setAssignDescription(e.target.value)}>
                                        </textarea>
                                    </div>
                                    <div className="issueDetailsItem">
                                        <label htmlFor="assignFile" className="issueDetailsLabel">Attachments</label>
                                        <input type="file" id="assignFile" name="assignFile" multiple onChange={(e) => setAssignFile(e.target.files)} />
                                    </div>
                                    <div className="issueDetailsItem">
                                        <div className="issueActions">
                                            <button className="btn-button save" type="submit" onClick={handleAssigneeChange}>Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }

                <IssueTracker issueId={issueId} />
               
            </div>
        </>
    );
};

export { SingleIssueView };