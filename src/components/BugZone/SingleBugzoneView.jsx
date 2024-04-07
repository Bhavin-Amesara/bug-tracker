import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UpdateBug from './UpdateBug';
import { formatDistanceToNow } from 'date-fns';

const SingleBugzoneView = ({ activeSingleBugzoneLink }) => {
    // get the bugzone id from the url
    const { id } = useParams();

    const [bugzone, setBugzone] = useState({});
    useEffect(() => {
        fetch('http://localhost:3300/api/issues/public-issues/'+id)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
            response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
            setBugzone(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);
    
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
                            <p>Up<span> {bugzone && bugzone?.upvotes}</span></p>
                            <p>Down<span> {bugzone && bugzone?.downvotes}</span></p>
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