import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Issues.scss";
import { Link } from "react-router-dom";
import SingleIssueDetailPage from "./SingleIssueDetailPage";
import SingleIssueAssign from "./SingleIssueAssign";
import SingleIssueEdit from "./SingleIssueEdit";
import ViewIssues from "./ViewIssues";
// import ViewIssues from "./ViewIssues";

const SingleIssueView = ({ activeSingleIssueLink }) => {
    
    var tempId = useParams().id;
    tempId = tempId.toString();
    const [issueId, setIssueId] = useState(tempId);

    return (
        <>
            <div className="container">
                <div className="issueHeader">
                    <div className="backButton">
                        <Link to="/issues"> 
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> Back </Link>
                    </div>
                </div>
                {
                    activeSingleIssueLink === 'singleIssueDetails' ? <SingleIssueDetailPage /> 
                    : activeSingleIssueLink === 'editSingleIssue' ? <SingleIssueEdit />
                    : activeSingleIssueLink === 'assignSingleIssue' ? 
                        <div className="issueTrackerContainer">
                            <SingleIssueAssign issueId={issueId} />
                        </div>
                    : activeSingleIssueLink === 'viewIssue' ? <ViewIssues />
                    : null
                }
            </div>
        </>
    );
};

export { SingleIssueView };