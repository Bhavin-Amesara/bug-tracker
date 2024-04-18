import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { useCommentContext } from '../../hooks/useCommentContext';

const AddReplyToComment = ({ commentId, issueId, setActiveEditComment }) => {
    // context
    const { user } = useAuthContext();
    const { dispatch: commentDispatch } = useCommentContext();

    const [reply, setReply] = useState('');

    const addReply = (e) => {
        e.preventDefault();
        setActiveEditComment(false); 
        const formData = new FormData();
        formData.append('comment', reply);
        formData.append('issueId', issueId);
        formData.append('commentedBy', user.userId);
        formData.append('parentId', commentId);
        console.log(Object.fromEntries(formData));
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
            if(data.status === true && (data.statusCode === 201 || data.statusCode === 200)) {
                setReply('');
                toast.success(data.message);
                commentDispatch({ type: "ADD_REPLY", payload: data.data });
            } else {
                toast.error(data.message);
            }
        });
    }
    return (
        <>
        <form className='d-flex'>
            <div className='addReply form-group form-group2'>
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder='Add a reply'></textarea>
            </div>
            <div className='form-group form-group2'>
                {/* <label htmlFor='addReply' className='btn btn-button'>
                    <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M13.544 10.456a4.368 4.368 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177"/><path d="M10.456 13.544a4.368 4.368 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823"/></g></g></svg>
                </label> */}
                {/* <input type='file' id='addReply' className='form-control' style={{ display: 'none' }} /> */}
                <button type='button' onClick={addReply} className='btn btn-button'>Add Reply</button>
            </div>
        </form></>
    )
}

export default AddReplyToComment;  