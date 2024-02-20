import './Issues.scss';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import ViewIssues from './ViewIssues';
import CreateIssue from './CreateIssue';
import { useState } from 'react';

const Issues = () => {
    // handle three views: view issues, create issue, and view single issue
    const [view, setView] = useState('viewIssues');


    return (
        <div className="issuecontent container">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Recent Bugs</div>
                <div className='issueMenu'>
                    <button className="btn-button" onClick={() => setView('viewIssues')}>View Issues</button>
                    <button className="btn-button" onClick={() => setView('createIssue')}>Create Issue</button>
                </div>
            </div>
            <div className="issueContent">
                {
                    view === 'viewIssues' ? <ViewIssues /> : 
                    view === 'createIssue' ? <CreateIssue /> : null
                }
            </div>
        </div>
    );
}

export default Issues;