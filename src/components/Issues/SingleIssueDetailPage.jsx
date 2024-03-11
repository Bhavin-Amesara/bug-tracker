import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddCommentToIssue from './AddCommentToIssue';


const SingleIssueDetailPage = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    
    useEffect(() => {
        fetch("http://localhost:3300/api/issues/" + id)
        .then((res) => res.json())
        .then((data) => setIssue(data.data));
    }, [id]);
    
    return (
        <div className='container SingleIssueDetailPage'>
        {issue && (
            <>
                <div className='issueDetail'>
                    <div className='issueDetailHeader'>
                        <h2>{issue.title} [{issue._id}]</h2>
                        <div className='issueDetailHeaderRight'>
                            <span className='issueTags'>{issue.status}</span>
                            <span className='issueTags'>{issue.priority}</span>
                            <span className='issueTags'>{issue.visibility}</span>
                            <span className='issueTags'>{issue.feature}</span>
                        </div>
                    </div>
                    <div className='issueDetailContent'>
                        <div className='issueDetailContentLeft'>
                            <div className='issueDetailContentLeftItem'>
                                <span className='issueDetailContentLeftItemLabel'>Issue Created:</span>
                                <span className='issueDetailContentLeftItemValue'>{issue.createdAt}</span>
                            </div>
                            <div className='issueDetailContentLeftItem'>
                                <span className='issueDetailContentLeftItemLabel'>Issue Updated:</span>
                                <span className='issueDetailContentLeftItemValue'>{issue.updatedAt}</span>
                            </div>
                        </div>
                        <div className='issueDetailContentRight'>
                            <div className='issueDetailContentRightItem'>
                                <span className='issueDetailContentRightItemLabel'>Issue Description:</span>
                                <span className='issueDetailContentRightItemValue'>{issue.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <AddCommentToIssue issueId={id} />
            </>
        )}
        </div>
    );
}

export default SingleIssueDetailPage;