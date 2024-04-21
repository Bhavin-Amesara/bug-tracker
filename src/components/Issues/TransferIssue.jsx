import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TransferIssue = ({ setActiveSingleIssueLink, setActiveSingleIssueReopenLink }) => {
    var tempId = useParams().id;
    tempId = tempId.toString();
    const [issueId, setIssueId] = useState(tempId);
    const [issue, setIssue] = useState(null);

    useEffect(() => {
        // fetch those user who are assigned to this issue
        fetch(`http://localhost:8000/api/issues/${issueId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data, "from transfer issue");
            setIssue(data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);
    

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
                        <a className="d-flex btn btn-button" onClick={goBackButton}>
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> Back 
                        </a>
                    </div>
                </div>
                Transfer Issue
            </div>
        </>
    );
}

export default TransferIssue;