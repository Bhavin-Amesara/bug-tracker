import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Issues.scss";
import { ToastContainer, toast } from "react-toastify";
import { useIssueContext } from "../../hooks/useIssueContext";
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../../hooks/useAuthContext";
const Swal = require("sweetalert2");
const withReactContent = require("sweetalert2-react-content");
const mySwal = withReactContent(Swal);

const TransferIssue = () => {
    // context
    const { singleIssue, dispatch } = useIssueContext();
    const { user } = useAuthContext();

    var tempId = useParams().id;
    tempId = tempId.toString();
    const navigate = useNavigate();
    const [issueId, setIssueId] = useState(tempId);

    const [member, setMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + issueId)
        .then((res) => res.json())
        .then((data) => {
            data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });    
            data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });            
            dispatch({ type: "SET_SINGLE_ISSUE", payload: data.data });
        });
    }, []);

    useEffect(() => {
        fetch("http://localhost:3300/api/issues/"+issueId+"/assignee")
        .then((response) => response.json())
        .then((response) => {
            if(response.status === false){
                toast.error(response.message);
            }
            // filter out the user who currently logged in
            response.data = response.data.filter((data) => data._id !== user.userId);
            setMember(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const transferIssue = (e) => {
        e.preventDefault();
        const transferTo = document.getElementById("transferTo").value;
        if(transferTo === ""){
            toast.error("Please select a member to transfer the issue");
            return;
        }
        console.log(transferTo);
        mySwal.fire({
            title: "Are you sure?",
            text: "You want to transfer this issue to another member",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, transfer it!",
        }).then((result) => {
            if (result.isConfirmed) {
            fetch("http://localhost:3300/api/issues/"+issueId+"/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    last_updated_by: user.userId,
                    transferId: transferTo
                }),
            })
            .then((response) => response.json())
            .then((response) => {
                if(response.status === false){
                    toast.error(response.message);
                }
                toast.success(response.message);
                navigate("/issues");
            })
            .catch((error) => {
                console.log(error);
            });
            }
        });
    }


    return (
        <>
            <div className="container">
                <ToastContainer />
                <div className="transferIssue">
                    <div className="transferIssueHeader">
                        <h2>Transfer Issue</h2>
                    </div>
                    <div className="transferIssueBody">
                    {singleIssue && 
                        <div className="transferIssueDetails">
                            <div className="transferIssueDetail">
                                <div className="transferIssueDetailTitle">
                                    <h4>Issue Title</h4>
                                </div>
                                <div className="transferIssueDetailValue">
                                    <p>{singleIssue.title}</p>
                                </div>
                            </div>
                            <div className="transferIssueDetail">
                                <div className="transferIssueDetailTitle">
                                    <h4>Issue Description</h4>
                                </div>
                                <div className="transferIssueDetailValue">
                                    <p>{singleIssue.description}</p>
                                </div>
                            </div>
                            <div className="transferIssueDetail">
                                <div className="transferIssueDetailTitle">
                                    <h4>Project Title</h4>
                                </div>
                                <div className="transferIssueDetailValue">
                                    <p>{singleIssue.project_id.title}</p>
                                </div>
                            </div>
                        </div>
                    }
                        <div className="form-group transferIssueForm">
                            <label htmlFor="transferTo">Transfer To</label>
                            <select className="form-control" id="transferTo" name="transferTo" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                                <option value="">Select</option>
                                {
                                    member.map((data, index) => {
                                        return (
                                            <option key={index} value={data._id}>{data.username}</option>
                                        );
                                    })
                                }
                            </select>
                            <div className="transferIssueFooter">
                                <button type="submit" className="btn btn-primary" onClick={transferIssue} {...(( user && user.role === "admin" || user.role === "manager" || user.userId === singleIssue.created_by._id) ? null : { disabled: true })}>Transfer</button>
                                <span className="error">Only the creator of the issue can transfer the issue</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TransferIssue;