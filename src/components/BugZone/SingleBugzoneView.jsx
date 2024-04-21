import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UpdateBug from './UpdateBug';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';
import AddCommentToPublic from './AddCommentToPublic';

const SingleBugzoneView = ({ activeSingleBugzoneLink }) => {
    // get the bugzone id from the url
    const { id } = useParams();
    // context
    const { user } = useAuthContext();

    const [bugzone, setBugzone] = useState({});
    const [isVoted, setIsVoted] = useState(false);
    const [votedInteraction, setVotedInteraction] = useState("");
    const [comments, setComments] = useState([]);
    const [activeEditComment, setActiveEditComment] = useState(false);
    const [openEditCommentId, setOpenEditCommentId] = useState("");
    const [editDescriptionValue, setEditDescriptionValue] = useState("");
    const [activeReplyToComment, setActiveReplyToComment] = useState(false);
    const [openCommentId, setOpenCommentId] = useState("");

    useEffect(() => {
        fetch('http://localhost:3300/api/public-issues/'+id+"?user_id="+user.userId)
        .then((response) => response.json())
        .then((response) => {
            console.log(response.data,"single-bugzone");
            response.data.publicIssue.createdAt = formatDistanceToNow(new Date(response.data?.publicIssue.createdAt), { addSuffix: true });
            response.data.publicIssue.updatedAt = formatDistanceToNow(new Date(response.data?.publicIssue.updatedAt), { addSuffix: true });
            setBugzone(response.data.publicIssue);
            setIsVoted(response.data.data.voted);
            setVotedInteraction(response.data.data.votedInteraction);
        })
        .catch((error) => {
            console.log(error);
        });

        fetch('http://localhost:3300/api/public-issues/comments/'+id)
        .then((response) => response.json())
        .then((response) => {
            console.log(response.data,"comments");
            setComments(response.data);
        })
    }, []);
    
    // public interaction
    const upvoteInteraction = (event) => {
        event.preventDefault();
        const interaction = "upvote";
        fetch('http://localhost:3300/api/public-issues/interaction/'+id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: user.userId,
                interaction: interaction
            }),
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.data.statusCode === 304) {
                alert(response.data.message);
            }else {
                response.data.publicIssue.createdAt = formatDistanceToNow(new Date(response.data?.publicIssue.createdAt), { addSuffix: true });
                response.data.publicIssue.updatedAt = formatDistanceToNow(new Date(response.data?.publicIssue.updatedAt), { addSuffix: true });
                setBugzone(response.data.publicIssue);
                setIsVoted(response.data.data.voted);
                setVotedInteraction(response.data.data.votedInteraction);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const downvoteInteraction = (event) => {
        event.preventDefault();
        const interaction = "downvote";
        fetch('http://localhost:3300/api/public-issues/interaction/'+id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: user.userId,
                interaction: interaction
            }),
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.data.statusCode === 304) {
                alert(response.data.message);
            }else {
                response.data.publicIssue.createdAt = formatDistanceToNow(new Date(response.data?.publicIssue.createdAt), { addSuffix: true });
                response.data.publicIssue.updatedAt = formatDistanceToNow(new Date(response.data?.publicIssue.updatedAt), { addSuffix: true });
                setBugzone(response.data.publicIssue);
                setIsVoted(response.data.data.voted);
                setVotedInteraction(response.data.data.votedInteraction);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // edit comment
    const editComment = (commentId, description) => {
        setActiveEditComment(true);
        setOpenEditCommentId(commentId);
        setEditDescriptionValue(description);
    }

    const editDescription = () => {
        fetch('http://localhost:3300/api/public-issues/comments/'+openEditCommentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                description: editDescriptionValue,
                user_id: user.userId
            }),
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.data.statusCode === 304) {
                alert(response.data.message);
            }else {
                response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
                response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
                setComments(comments.map((comment) => comment._id === openEditCommentId ? response.data : comment));
                setActiveEditComment(false);
                setOpenEditCommentId("");
                setEditDescriptionValue("");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // delete comment
    const deleteComment = (commentId) => {
        fetch('http://localhost:3300/api/public-issues/comments/'+commentId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: user.userId
            }),
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.data.statusCode === 304) {
                alert(response.data.message);
            }else {
                setComments(comments.filter((comment) => comment._id !== commentId));
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // reply to comment
    const toggleReplyBackToComment = (commentId) => {
        setActiveReplyToComment(!activeReplyToComment);
        setOpenCommentId(commentId);
    }

    
    return (
        <>
        <div className="container">
                <div className="commonEditHeader">
                    <div className="backButton">
                        <Link to="/bugzones"> 
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> Back </Link>
                    </div>
                </div>
                { activeSingleBugzoneLink === "viewSingleBugzone" ?<>
                <div className="singleProjectView viewSingleBugzone inner-container d-flex d-flex-column">
                    <div className="singleProjectDetails">
                        <div className="singleProjectContent">
                            <h2>{bugzone && bugzone?.title}</h2>
                            <p>Creator<span>{bugzone && bugzone?.created_by?.username}</span></p>
                            <p>Description<span>{bugzone && bugzone?.description}</span></p>            
                            <p>Feature<span>{bugzone && bugzone?.feature}</span></p>
                            <p>Status<span>{bugzone && bugzone?.status}</span></p>
                            <p>Up<span> 
                                {bugzone && bugzone?.upvotes}
                                <button id="vote1" className={isVoted ? votedInteraction === "upvote" ? "btn btn-button upvote-filled" : "btn btn-button upvote" : "btn btn-button upvote" } onClick={upvoteInteraction}>
                                <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m11.605 5.782l.23-2.369c.091-.952.98-1.598 1.878-1.366c1.351.35 2.3 1.605 2.3 3.044v3.035c0 .675 0 1.013.146 1.26c.083.141.197.26.333.345c.24.151.567.151 1.22.151h.396c1.703 0 2.554 0 3.078.39c.393.293.67.722.78 1.208c.146.65-.181 1.463-.836 3.087l-.326.81a3.261 3.261 0 0 0-.226 1.48c.232 2.874-2.047 5.295-4.833 5.136l-10.424-.599c-1.139-.065-1.708-.098-2.222-.553c-.515-.455-.612-.924-.805-1.861a14.324 14.324 0 0 1 .055-6.037c.283-1.248 1.475-1.92 2.706-1.76c3.264.42 6.223-2.019 6.55-5.4Z"/><path d="m7 11.5l-.137.457A14.983 14.983 0 0 0 7 21"/></g></g></svg>
                                </button>
                                </span></p>
                            <p>Down<span> 
                                {bugzone && bugzone?.downvotes}
                                <button id="vote2" className={isVoted ? votedInteraction === "downvote" ? "btn btn-button downvote-filled" : "btn btn-button downvote" : "btn btn-button downvote" } onClick={downvoteInteraction}>
                                <svg viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m12.395 18.218l-.23 2.369c-.091.952-.98 1.598-1.878 1.366c-1.351-.35-2.3-1.605-2.3-3.044v-3.035c0-.675 0-1.013-.146-1.26a1.018 1.018 0 0 0-.333-.345c-.24-.151-.567-.151-1.22-.151h-.396c-1.703 0-2.554 0-3.078-.39a2.073 2.073 0 0 1-.78-1.208c-.146-.65.181-1.463.836-3.087l.327-.81c.188-.468.265-.975.225-1.48c-.232-2.874 2.047-5.295 4.833-5.135l10.424.598c1.139.065 1.708.098 2.222.553c.515.455.612.924.805 1.861a14.317 14.317 0 0 1-.055 6.037c-.283 1.248-1.475 1.92-2.706 1.76c-3.264-.42-6.223 2.019-6.55 5.4Z"/><path d="m17 12.5l.137-.457c.887-2.956.84-6.115-.137-9.043"/></g></g></svg>
                                </button>
                                </span></p>
                            <p>Created At<span>{bugzone && bugzone?.createdAt}</span></p>
                            <p>Updated At<span>{bugzone && bugzone?.updatedAt}</span></p>
                        </div>
                        <AddCommentToPublic issueId={id} />
                    </div>
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
                        </div>
                    ))}
                    </div>
                    }
                </div>
                </>
                : activeSingleBugzoneLink === "editSingleBugzone" ?
                    <UpdateBug />
                :null}
            </div>
        </>
    );
    }
export default SingleBugzoneView;