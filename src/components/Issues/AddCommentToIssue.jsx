import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from 'react-toastify';
const AddCommentToIssue = ({ issueId }) => {
    // context
    const { user } = useAuthContext();
    const [comment, setComment] = useState('');
    const addComment = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('issueId', issueId);
        formData.append('commentedBy', user.userId);

        fetch("http://localhost:3300/api/issues/comments/" + issueId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data.success === true && data.status === 201) {
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
            <div className='addComment form-group form-group2'>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a comment'></textarea>
            </div>
            <div className='form-group form-group2'>
                <button className='btn btn-button'>
                <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M13.544 10.456a4.368 4.368 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177"/><path d="M10.456 13.544a4.368 4.368 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823"/></g></g></svg></button>
                <button type='button' onClick={addComment} className='btn btn-button'>Add Comment</button>
            </div>
        </form></>
    );
}
export default AddCommentToIssue;