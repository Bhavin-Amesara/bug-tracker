import './Issues.scss';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import ViewIssues from './ViewIssues';
import CreateIssue from './CreateIssue';
import { useState } from 'react';

const Issues = () => {
    // handle three views: view issues, create issue, and view single issue
    const [view, setView] = useState('viewIssues');

    // set active class for the view
    const handleActive = (props) => {
        if(props === 'viewIssues'){
            setView('viewIssues');
            document.getElementById('createIssue').classList.remove('active');
            document.getElementById('viewIssues').classList.add('active');
        } else if(props === 'createIssue'){
            setView('createIssue');
            document.getElementById('viewIssues').classList.remove('active');
            document.getElementById('createIssue').classList.add('active');
        }
    }

    return (
        <div className="issuecontent container">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Recent Bugs</div>
                <div className='issueMenu'>
                    <button id="viewIssues" className="btn-button active" onClick={() => {handleActive('viewIssues');}}>View Issues</button>
                    <button id="createIssue" className="btn-button" onClick={() => {handleActive('createIssue');}}>Create Issue</button>
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