import './Issues.scss';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import ViewIssues from './ViewIssues';
import CreateIssue from './CreateIssue';
import { useAuthContext } from '../../hooks/useAuthContext';

const Issues = ({ activeIssueLink }) => {
    // context
    const { user } = useAuthContext();

    console.log(activeIssueLink);
    
    return (
        <div className="issuecontent container">
            <div className="issueHeader">
                { activeIssueLink === 'viewIssues' ? <div className="table-title dashboard-title">Recent Issues</div> : null }
            </div>
            <div className="issueContent">
                {
                    activeIssueLink === 'viewIssues' ? <ViewIssues /> : 
                    activeIssueLink === 'createIssue' ? 
                    user.isLoggedIn && (user.role === "admin" || user.role === "manager" || user.role === "developer") ?
                    <CreateIssue /> 
                    : <div className="alert alert-danger">You are not authorized to create an issue</div>
                    : null
                }
            </div>
        </div>
    );
}

export default Issues;