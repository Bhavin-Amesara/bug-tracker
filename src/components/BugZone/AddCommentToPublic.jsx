import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from 'react-toastify';
const AddCommentToPublic = ({ issueId }) => {
    // context
    const { user } = useAuthContext();

    const [comment, setComment] = useState('');
    const addComment = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('issueId', issueId);
        formData.append('commentedBy', user.userId);

        fetch("http://localhost:3300/api/public-issues/comments/" + issueId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data.status === true && (data.statusCode === 201 || data.statusCode === 200)) {
                setComment('');
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        });
    }
    return (
        <><ToastContainer />
        <form className='formBodyIssue'>
            <h2>Add Comment</h2>
            <div className='addComment form-group form-group2'>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a comment to public issue'></textarea>
            </div>
            <div className='form-group form-group2'>
                <button type='button' onClick={addComment} className='btn btn-button'>Add Comment</button>
            </div>
        </form></>
    );
}
export default AddCommentToPublic;