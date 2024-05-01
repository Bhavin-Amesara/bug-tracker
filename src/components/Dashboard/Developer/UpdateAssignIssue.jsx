import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateAssignIssue = ({singleIssue}) => {
    // context
    const { user } = useAuthContext();
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    useEffect(() => {
        if (singleIssue) {
            setDesc(singleIssue.description);
            setStatus(singleIssue.status);
        }
    }
    , [singleIssue]);

    const handleFormUpdate = (e) => {
        e.preventDefault();
        if (status === singleIssue.status) {
            toast.error('Please update the status to submit the issue');
            return;
        }
        if (desc === '' || desc === undefined) {
            toast.error('Please provide a description');
            return;
        }
        const formData = new FormData();
        formData.append('status', status);
        formData.append('description', desc);
        formData.append('user_id', user.userId);
        formData.append('issue_id', singleIssue.issue_id._id);
        fetch('http://localhost:3300/api/issue-tracker/' + singleIssue._id + '/updateStatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === true) {
                toast.success('Issue updated successfully');
            } else {
                toast.error('Failed to update issue');
            }
        });
    }

    return (
        <div className="singleCommonEdit ">
            <ToastContainer />
            <div className="commonEditHeader">
                <div className="table-title dashboard-title">Update Issue</div>
            </div>
            <div className="commonEditDetails">
                <div className="commonEditActualContent">
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Title</div>
                    <div className="commonEditDetailsValue">{singleIssue?.issue_id?.title}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Project</div>
                    <div className="commonEditDetailsValue">{singleIssue?.project}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Assigned By</div>
                    <div className="commonEditDetailsValue">{singleIssue?.assigned_by?.username}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Comment</div>
                    <div className="commonEditDetailsValue">{singleIssue?.comment}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Update At</div>
                    <div className="commonEditDetailsValue">{singleIssue?.updatedAt}</div>
                </div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Status</div>
                    <div className="commonEditControls d-flex" >
                        {user && user.role==="manager" || user.role==="admin" || user.userId !== singleIssue?.created_by?._id ?
                        <>
                            <select className="commonEditDetailsValue" name="status" id="status" value={status} disabled={!editStatus} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <span className={editStatus?"material-symbols-outlined active":"material-symbols-outlined"}
                            onClick={() => setEditStatus(!editStatus)}>edit</span>
                        </>
                            : 
                        <>
                            <div className="commonEditDetailsValue">{singleIssue?.status}</div>
                        </>
                        }
                    </div>
                </div>
                <div className="commonEditDetailsItemDesc">
                    <textarea className="commonEditDetailsValue" name="description" id="description" disabled={!editDescription} onChange={(e) => setDesc(e.target.value)} value={desc} placeholder='Add reply...'>
                    </textarea>
                    <span className={editDescription?"material-symbols-outlined active":"material-symbols-outlined"}
                    onClick={() => setEditDescription(!editDescription)}>edit</span>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditActions">
                        {user && user.role==="manager" || user.role==="admin" || user.userId !== singleIssue?.created_by?._id ?
                        singleIssue?.status !== 'on-hold' ? 
                        <button className="btn-button save" type="submit" onClick={handleFormUpdate}>
                            {status === 'resolved' ? 'Submit' : 'Update'}
                        </button>
                        :
                        <button className="btn-button disabled" type="submit" disabled>
                            On Hold
                        </button>
                        :
                        <button className="btn-button disabled" type="submit" disabled>
                            Not Allowed
                        </button>
                        }
                        <p className='d-flex warning2'><span className="material-symbols-outlined mr-10">info</span>{ status === 'resolved' ? 'If you mark this issue as resolved, it will be go for review' : 'Report your progress by updating the status'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateAssignIssue;
