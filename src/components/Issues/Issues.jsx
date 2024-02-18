import './Issues.scss';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import ViewIssues from './ViewIssues';
import CreateIssue from './CreateIssue';
import { useState } from 'react';

const Issues = () => {
    const [toogleIssue, setToogleIssue] = useState(false);

    const handleToogleIssue = () => {
        setToogleIssue(!toogleIssue);
        document.querySelector('button.createIssue').classList.toggle('active');
    }

    return (
        <div className="issuecontent container">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Recent Bugs</div>
                <div className='issueMenu'>
                    <button className="createIssue" onClick={() => handleToogleIssue()}>Create Issue</button>
                </div>
            </div>
            <div className="issueContent">
                {toogleIssue ? <CreateIssue /> : <ViewIssues />}
            </div>
        </div>
    );
}

export default Issues;