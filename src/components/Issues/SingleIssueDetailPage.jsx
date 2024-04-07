import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddCommentToIssue from './AddCommentToIssue';
import { formatDistanceToNow } from "date-fns";

const SingleIssueDetailPage = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + id)
        .then((res) => res.json())
        .then((data) => {
            data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });    
            data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });            
            setIssue(data.data);
        });

        fetch("http://localhost:3300/api/issues/comments/" + id)
        .then((res) => res.json())
        .then((data) => {
            setComments(data.data);
        });
    }, [id]);
    
    return (
        <div className='container SingleIssueDetailPage'>
        {issue && (
            <>
                <div className='issueDetailContainer'>
                    <div className='issueDetail'>
                        <div className='issueDetailHeader'>
                            <h2>{issue.title} <span>[{issue._id}]</span></h2>
                            <div className='issueDetailHeaderRight'>
                                <span className={issue.status === 'resolved' ? 'issueTags success' : 'issueTags'}
                                >Status: {issue.status}</span>
                                <span className='issueTags'>Priority: {issue.priority}</span>
                                <span className='issueTags'>Feature: {issue.feature}</span>
                            </div>
                        </div>
                        <div className='issueDetailContents'>
                            <div className='issueDetailContent'>
                                <div className='issueDetailContentItem'>
                                    <span className='issueDetailContentItemLabel'>Issue Description: </span>
                                    <span className='issueDetailContentItemValue'>{issue.description}</span>
                                </div>
                            </div>
                            <div className='issueDetailContent'>
                                <div className='issueDetailContentItem'>
                                    <span className='issueDetailContentItemLabel'>Issue Created: </span>
                                    <span className='issueDetailContentItemValue'>{issue.createdAt}</span>
                                </div>
                                <div className='issueDetailContentItem'>
                                    <span className='issueDetailContentItemLabel'>Issue Updated: </span>
                                    <span className='issueDetailContentItemValue'>{issue.updatedAt}</span>
                                </div>
                            </div>                        
                        </div>
                    </div>
                    <AddCommentToIssue issueId={id} /></div>
                <div className='commentsForIssue'>
                    <h1>Comments ({comments.length})</h1> 
                    {comments.map((comment) => (
                        <div key={comment._id} className='commentForIssue'>
                            <div className='commentHeader'>
                                <div><span>User:</span> <strong>@{comment.created_by.username}</strong></div>
                                {/* <div><span>Create At:</span> <span>{comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span></div> */}
                            </div>
                            <div className='commentBody'>
                                <p><span>Description:</span> {comment.description}</p>
                            </div>
                            {/* add link like reply to, edit, delete */}
                            <div className='commentFooter'>
                                <div className='commentLinks'><span><button className='btn btn-button'>
                                    <svg viewBox="0 0 16 16" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306a7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028a.147.147 0 0 1 0-.252a.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"/></g></svg></button>
                                </span>
                                <span><button className='btn btn-button'>
                                    <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z"/><path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"/></g></g></svg></button>
                                </span>
                                <span><button className='btn btn-button cancel'>
                                    <svg viewBox="0 0 1024 1024" fill="#E8403E" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"/></g></svg></button>
                                </span></div>
                                <div className='commentAck'><span>Last Modified:</span> <span>{comment.updatedAt && formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
        </div>
    );
}

export default SingleIssueDetailPage;