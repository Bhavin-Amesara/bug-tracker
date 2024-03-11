import React, { useState } from 'react';
const AddCommentToIssue = ({ issueId }) => {
    const [comment, setComment] = useState('');
    const handleComment = (e) => {
        setComment(e.target.value);
    }
    const addComment = () => {
        fetch("http://localhost:3300/api/issues/" + issueId + "/comments", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: comment }),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success){
                setComment('');
                alert('Comment added successfully');
            } else {
                alert('Error adding comment');
            }
        });
    }
    return (
        <form className='formBody'>
            <div className='addComment form-group'>
                <textarea value={comment} onChange={handleComment} placeholder='Add a comment'></textarea>
            </div>
            <button type='button' onClick={addComment} className='btn-button'>Add Comment</button>
        </form>
    );
}
export default AddCommentToIssue;