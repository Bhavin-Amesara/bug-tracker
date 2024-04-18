import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UpdateBug from './UpdateBug';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';

const SingleBugzoneView = ({ activeSingleBugzoneLink }) => {
    // get the bugzone id from the url
    const { id } = useParams();
    // context
    const { user } = useAuthContext();

    const [bugzone, setBugzone] = useState({});
    const [isVoted, setIsVoted] = useState(false);
    const [votedInteraction, setVotedInteraction] = useState("");
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
                { activeSingleBugzoneLink === "viewSingleBugzone" ?
                <div className="singleProjectView inner-container d-flex d-flex-column">
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
                    </div>
                </div>
                : activeSingleBugzoneLink === "editSingleBugzone" ?
                    <UpdateBug />
                :null}
            </div>
        </>
    );
    }
export default SingleBugzoneView;