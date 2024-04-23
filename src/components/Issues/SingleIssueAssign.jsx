import React from "react";
import "./Issues.scss";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useIssueContext } from "../../hooks/useIssueContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useIssueTrackerContext } from "../../hooks/useIssueTrackerContext";
import { useParams } from "react-router-dom";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";


const SingleIssueAssign = ({ issueId }) => {
    const { user } = useAuthContext();
    const { singleIssue, getSingleIssue, assignIssue } = useIssueContext();
    const { issuesTracker, dispatch:dispatchIssueTracker } = useIssueTrackerContext();

    const mySwal = withReactContent(Swal);
        
    // single issue assign user start
    const userId = user && user.isLoggedIn ? user.userId : "";
    const [assignedBy, setAssignedBy] = useState(userId);
    const [assignTo, setAssignTo] = useState("");
    const [assignDescription, setAssignDescription] = useState("");
    const [assignFile, setAssignFile] = useState("");
    const [assignIssueId, setAssignIssueId] = useState(issueId);
    const [assignStatus, setAssignStatus] = useState("open");
    
    const handleAssigneeChange = (e) => {
        e.preventDefault();
        if(assignTo === "") {
            mySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a member to assign',
                dangerMode: true,
            });
            return;
        }
        if(assignDescription === "") {
            mySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please add some comments',
                dangerMode: true,
            });
            return;
        }
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
        
        setAssignDescription("");
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
            if (response.statusCode === 400) {
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
            toast.success(response.message);
            document.getElementById("assignUserForm").reset(); 
        })
        .catch((error) => {
            console.log(error);
        });
    }


    // fecth user data pass body role[developer]
    const [member, setMember] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/"+issueId+"/assignee")
        .then((response) => response.json())
        .then((response) => {
            if(response.status === false){
                toast.error(response.message);
            }
            response.data = response.data.filter((data) => data._id !== user.userId);
            setMember(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    // issue tracker start
    // context api
    // const { dispatch, issuesTracker } = useIssueTrackerContext();

    // fetch issue tracker
    useEffect(() => {
        fetch("http://localhost:3300/api/issue-tracker/" + issueId)
        .then((response) => response.json())
        .then((response) => {
            console.log(response, "response from issue tracker path: components/Issues/IssueTracker.jsx");
            // use date-fns to format date
            response.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });
            dispatchIssueTracker({ type: "SET_ISSUES_TRACKER", payload: response.data });
        })
        .catch((error) => {
            console.log(error, "error from issue tracker path: components/Issues/IssueTracker.jsx");
        });
    }, [dispatchIssueTracker]);

    // datatable
    if(issuesTracker !== null && issuesTracker !== undefined){
        $("#issuesTrackerTable").DataTable({
            data: issuesTracker,
            columns: [
                { title: "Assigned To", data: "assigned_to.username" },
                { title: "Status", data: "status" },
                { title: "Comment", data: "comment" , "render" : function(data, type, row) {
                    return data.length > 15 ? data.substr(0, 15) + '…' : data;
                } },
                { title: "Updated At", data: "updatedAt" },
                { title: "Action", data: null, "render": function (data, type, row) {
                    return `<button class="btn-button" data-id="${data._id}">
                        <svg width="186px" viewBox="0 0 24 24" fill="#3A76F5" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="#3A76F5"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78L4 6Zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6l1.345-2.853ZM2 6h20m-12 5v5m4-5v5"/></g></svg>
                    </button>`;
                }},
            ],
            "order": [[ 2, "Updated At" ]],
            "bDestroy": true,
            "bAutoWidth": false,
        });
    }

    // delete issue tracker
    useEffect(() => {
        $('#issuesTrackerTable').on('click', 'button', function() {
            const id = $(this).data("id");
            fetch("http://localhost:3300/api/issue-tracker/" + id, {
                method: 'DELETE',
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response, "response from issue tracker delete path: components/Issues/IssueTracker.jsx");
                if (!response.data) {
                    toast.error(response.message);
                    return;
                }
                dispatchIssueTracker({ type: "DELETE_ISSUE_TRACKER", payload: id });
                toast.success(response.message);
            })
            .catch((error) => {
                console.log(error, "error from issue tracker delete path: components/Issues/IssueTracker.jsx");
            });
        });

        return () => {
            $('#issuesTrackerTable').off('click', 'button');
        };
    }, []);

    return (
        <>
    <div className="assignUser">                      
        <div className="assignUserContent">
            <div className=" singleCommonViews d-flex-column">
                <div className="commonEditHeader">
                    <div className="table-title dashboard-title">Assign Issue</div>
                </div>
                <form className="commonEditDetailsForm" encType='multipart/form-data' method='post' id='assignUserForm' name='assignUserForm' >
                    <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Issue</div>
                        <div className="issueDetailsValue" id="issueTitle">{singleIssue?.title}</div>
                        {/* <input type="hidden" name="assignIssueId" id="assignIssueId" value={issueId} /> */}
                    </div>
                    <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Assignee</div>
                        <div className="issueControls d-flex">
                            <select className="issueDetailsValue" name="assignTo" id="assignTo" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                                <option value="">Select Member</option>
                                {member && member.length>0 && member.map((mem) => {
                                    return <option key={mem._id} value={mem._id}>{mem.username}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    {/* <div className="issueDetailsItem">
                        <div className="issueDetailsLabel">Status</div>
                        <div className="issueControls d-flex">
                            <select className="issueDetailsValue" name="assignUserStatus" id="assignUserStatus" value={assignStatus} onChange={(e) => setAssignStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div> */}
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

    <div style={{minWidth: "55%"}} >
        <ToastContainer />
        <div className="singleIssueTracker">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Issue Tracker</div>
            </div>
            <div className="issueTable">
                <table id="issuesTrackerTable" className="display"></table>
            </div>
        </div>
    </div>
    </>
    );
}

export default SingleIssueAssign;