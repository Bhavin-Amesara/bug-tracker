import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Issues.scss";
import { Link, useNavigate } from "react-router-dom";
import SingleIssueDetailPage from "./SingleIssueDetailPage";
import SingleIssueAssign from "./SingleIssueAssign";
import SingleIssueEdit from "./SingleIssueEdit";
import ViewIssues from "./ViewIssues";
import TransferIssue from "./TransferIssue";
import { CommentContextProvider } from "../../context/CommentContext";

const SingleIssueView = ({ activeSingleIssueLink, setActiveSingleIssueReopenLink, activeSingleIssueReopenLink, setActiveSingleIssueLink }) => {
    var tempId = useParams().id;
    tempId = tempId.toString();
    const [issueId, setIssueId] = useState(tempId);
    const [issue, setIssue] = useState(null);
    const navigate = useNavigate();

    const goBackButton = () => {
        setActiveSingleIssueLink('singleIssueDetails');
        setActiveSingleIssueReopenLink(false);
        navigate("/issues");
    }
    return (
        <>
            <div className="container">
                <div className="issueHeader">
                    <div className="backButton">
                        {/* <Link to="/issues">  */}
                        <a className="d-flex btn btn-button" onClick={goBackButton}>
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> Back 
                        </a>
                        {/* </Link> */}
                    </div>
                </div>
                {
                    activeSingleIssueLink === 'singleIssueDetails' ? 
                    <CommentContextProvider>
                        <SingleIssueDetailPage 
                            setActiveSingleIssueReopenLink={setActiveSingleIssueReopenLink} 
                            activeSingleIssueReopenLink={activeSingleIssueReopenLink}
                        />
                    </CommentContextProvider>
                    : activeSingleIssueLink === 'editSingleIssue' ? <SingleIssueEdit />
                    : activeSingleIssueLink === 'assignSingleIssue' ? 
                        <div className="issueTrackerContainer">
                            <SingleIssueAssign issueId={issueId} />
                        </div>
                    : activeSingleIssueLink === 'viewIssue' ? <ViewIssues />
                    : activeSingleIssueLink === 'transferSingleIssue' ? <TransferIssue />
                    : null
                }
            </div>
        </>
    );
};

export { SingleIssueView };