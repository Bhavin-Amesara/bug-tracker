import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddCommentToIssue from './AddCommentToIssue';
import { formatDistanceToNow } from "date-fns";
import { useIssueContext } from '../../hooks/useIssueContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCommentContext } from '../../hooks/useCommentContext';
import { toast } from 'react-toastify';
import AddReplyToComment  from './AddReplyToComment';
import ViewComments from './ViewComments';
const Swal = require("sweetalert2");
const withReactContent = require("sweetalert2-react-content");
const mySwal = withReactContent(Swal);

const SingleIssueDetailPage = ({ setActiveSingleIssueReopenLink, activeSingleIssueReopenLink }) => {
    // context
    const { singleIssue:issue, dispatch } = useIssueContext();
    const { comments, dispatch:commentDispatch } = useCommentContext();
    const { user } = useAuthContext();

    const { id } = useParams();
    const [promptReopenIssue, setPromptReopenIssue] = useState(true);

    const getFormattedReply = (comment) => {
        var modifyComments2 = comment;

        modifyComments2.forEach((comment) => {
            if (comment.parent_id && comment.parent_id.length > 0) {
                modifyComments2.forEach((reply) => {
                    if (comment.parent_id.includes(reply._id)) {
                        // add reply to parent comment
                        if (!reply.replies) {
                            reply.replies = [];
                        }
                        reply.replies.push(comment);
                        // remove comment from modifyComments2
                        modifyComments2 = modifyComments2.filter((item) => item._id !== comment._id);
                    }
                });
            }
        });
        return modifyComments2;
    }
    
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + id)
        .then((res) => res.json())
        .then((data) => {
            data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });    
            data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });            
            dispatch({ type: "SET_SINGLE_ISSUE", payload: data.data });
        });

        fetch("http://localhost:3300/api/issues/comments/" + id)
        .then((res) => res.json())
        .then((data) => {
            const modifyComments = getFormattedReply(data.data);
            
            console.log(modifyComments, 'modifyComments');
            commentDispatch({ type: "SET_COMMENTS", payload: modifyComments });
        });

    }, [id, dispatch, commentDispatch]);
    const reOpenIssue = () => {
        mySwal.fire({
            title: 'Reopen Issue',
            text: 'Are you sure you want to reopen this issue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Reopen',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if(result.isConfirmed) {
                setActiveSingleIssueReopenLink(!activeSingleIssueReopenLink);
            }
        });
    }

    const [activeReplyToComment, setActiveReplyToComment] = useState(false);
    const [openCommentId, setOpenCommentId] = useState('');
    const toggleReplyBackToComment = (commentId) => {
        if(activeReplyToComment && openCommentId === commentId) {
            setActiveReplyToComment(!activeReplyToComment);
            setOpenCommentId('');
            return;
        } else {
            setActiveReplyToComment(true);
            setOpenCommentId(commentId);
        }
    }

    const [activeEditComment, setActiveEditComment] = useState(false);
    const [openEditCommentId, setOpenEditCommentId] = useState('');
    const [editDescriptionValue, setEditDescriptionValue] = useState('');
    const editComment = (commentId, commentDesc) => {
        if(activeEditComment && openEditCommentId === commentId) {
            setActiveEditComment(!activeEditComment);
            setOpenEditCommentId('');
            setEditDescriptionValue(commentDesc);
            return;
        } else {
            setEditDescriptionValue("");
            setActiveEditComment(true);
            setOpenEditCommentId(commentId);
        }
    }

    const editDescription = (e) => {
        e.preventDefault();
        setActiveEditComment(!activeEditComment);
        const formData = new FormData();
        formData.append('comment', editDescriptionValue);
        formData.append('commentedBy', user.userId);
        console.log(Object.fromEntries(formData), 'formData');
        fetch("http://localhost:3300/api/issues/comments/" + id + "/" + openEditCommentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data.status === true && (data.statusCode === 201 || data.statusCode === 200)) {
                setEditDescriptionValue('');
                toast.success(data.message);
                commentDispatch({ type: "UPDATE_COMMENT", payload: data.data });
            } else {
                toast.error(data.message);
            }
        });
    }

    const deleteComment = (commentId) => {
        mySwal.fire({
            title: 'Delete Comment',
            text: 'Are you sure you want to delete this comment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if(result.isConfirmed) {
                fetch("http://localhost:3300/api/issues/comments/" + id + "/" + commentId, {
                    method: 'DELETE',
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if(data.status === true && (data.statusCode === 201 || data.statusCode === 200)) {
                        toast.success(data.message);
                        commentDispatch({ type: "SET_COMMENT", payload: commentId });
                    } else {
                        toast.error(data.message);
                    }
                });
            }
        });
    }


    
    return (
        <div className='container SingleIssueDetailPage'>
        {issue && (
            <>
                <div className='issueDetailContainer'>
                    <div className='issueDetail'>
                        <div className='issueDetailHeader'>
                            <h2>{issue.title} <span>[{issue._id}]</span></h2>
                            <div className='issueDetailHeaderRight'>
                                <span className={issue.status === 'resolved' ? 'issueTags success2' : 'issueTags'}
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
                    { promptReopenIssue && (issue.status === 'resolved' && !activeSingleIssueReopenLink) &&
                    <div className='promptToReopenIssue'>
                        <span className='issueAcknowledgeStatus warning'>
                            Want to again open this issue? 
                            <button className='ml-10 btn btn-button' onClick={() =>  reOpenIssue()}>Reopen Issue</button>
                        </span>
                        <button className='prompt-cancel cancel d-a-flex' onClick={() => setPromptReopenIssue(false)}>
                            <svg viewBox="0 0 1024 1024" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" fillRule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64Zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372Zm128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></g></svg>
                        </button>
                    </div>
                    }
                    { comments && comments.length === 0 ? <h1>No Comments</h1> : comments &&
                    <div className='commentsForIssue'>
                    <h1>Comments ({comments.length})</h1> 
                    {comments.map((comment) => (
                        <div key={comment._id} className='commentForIssue'>
                            <div className='commentHeader'>
                                <div><span>User:</span> <strong>@{comment.created_by.username}</strong></div>
                            </div>
                            <div className={activeEditComment && openEditCommentId === comment._id ? 'editCommentDesc' : 'commentBody'}>
                                {activeEditComment && openEditCommentId === comment._id ?
                                <>
                                    <form className='d-flex'>
                                        <span>Description:</span>
                                        <div className='addReply form-group form-group2'>
                                            <textarea value={editDescriptionValue?editDescriptionValue:comment.description} onChange={(e) => setEditDescriptionValue(e.target.value)} placeholder='Add new description'></textarea>
                                        </div>
                                        <div className='form-group form-group2'>
                                            <button type='button' onClick={editDescription} className='btn btn-button'>Edit Desscription</button>
                                        </div>
                                    </form>
                                </>
                                :   <p><span>Description:</span> {comment.description}</p>
                                }
                            </div>
                            <div className='commentFooter'>
                                <div className='commentLinks'><span><button className={activeReplyToComment && openCommentId === comment._id ? 'btn btn-button cancel' : 'btn btn-button'} onClick={() => toggleReplyBackToComment(comment._id)}>
                                    {activeReplyToComment && openCommentId === comment._id ?
                                        <svg viewBox="0 0 1024 1024" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" fillRule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64Zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372Zm128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></g></svg>
                                    :   <svg viewBox="0 0 16 16" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306a7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028a.147.147 0 0 1 0-.252a.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"/></g></svg>
                                    }</button>
                                </span>
                                {comment && comment.replies && comment.replies.length > 0 ? null : 
                                    comment.created_by._id === user.userId &&
                                <span><button className={activeEditComment && openEditCommentId === comment._id ? 'btn btn-button cancel' : 'btn btn-button'} onClick={() => editComment(comment._id, comment.description)}>
                                    {activeEditComment && openEditCommentId === comment._id ?
                                        <svg viewBox="0 0 1024 1024" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" fillRule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64Zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372Zm128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></g></svg>
                                    :   <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z"/><path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"/></g></g></svg>
                                    }</button>
                                </span>
                                }
                                {comment.created_by._id === user.userId || user.role === 'admin' || user.role === 'manager' ?
                                <span><button className='btn btn-button cancel' onClick={() => deleteComment(comment._id)}>
                                    <svg viewBox="0 0 1024 1024" fill="#E8403E" x="128" y="128" role="img"  xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"/></g></svg></button>
                                </span>
                                : null }
                                </div>
                                <div className='commentAck'><span>Last Modified:</span> <span>{comment.updatedAt && formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}</span></div>
                            </div>
                            { activeReplyToComment &&  openCommentId === comment._id &&
                                <div className='replyToComment'>
                                    <AddReplyToComment commentId={comment._id} issueId={id} setActiveEditComment={setActiveEditComment} />
                                </div> 
                            }
                            {comment.replies &&  
                                <ViewComments comments={comment.replies}/>
                            }
                        </div>
                    ))}
                </div> }
            </>
        )}
        </div>
    );
}

export default React.memo(SingleIssueDetailPage);