import './Issues.scss';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import DataTable from 'datatables.net';
import { Link } from 'react-router-dom';
import ViewIssues from './ViewIssues';
import CreateIssue from './CreateIssue';

const Issues = ({ userDetails }) => {
    // const [userdata, setuserData] = useState([{}]);
    const [issuedata, setissueData] = useState([{}]);
    const [issueTracker, setIssueTracker] = useState([{}]);
    const [responseMessage, setResponseMessage] = useState("");
    var random = "nitish";
    
    useEffect(() => {
        fetch("api/issues")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setissueData(data);
        })
    }, [random]);

    useEffect(() => {
        fetch("api/issue-tracker")
        .then((response) => response.json())
        .then((data) => {
            if(data.message === "Unauthorized"){
                setResponseMessage(data.message);
            }
            setIssueTracker(data);
        })
    }, [random]);

    // console.log(issuedata.issues);
    // console.log(issueTracker.issueTracker);

    // try {
        
    // format mongodb date to normal date
    // var date = new Date(issuedata.issues[0].updatedAt);
    // // format date to Sun, 21 Mar 2021 
    // var formattedDate = date.toDateString();
    // setissueData({ ...issuedata, updatedAt: formattedDate });
    // console.log(formattedDate);
    // console.log(issuedata.issues[0].updatedAt);
    
    // } catch (error) {
    //     console.log(error);
    // }

    if(issuedata.issues !== undefined){
        let table = $('#table_id').DataTable({
            data: issuedata.issues,
            columns: [
                { data: "title", title: "Title" },
                { data: "description", title: "Description" },
                { data: "project_id.projectname", title: "Project" },
                { data: "created_by.username", title: "Created By" }, // "created_by": "username",
                { data: "status", title: "Status" },
                { data: "priority", title: "Priority" },
                { data: "updatedAt", title: "Updated At" }
            ],
            "bDestroy": true,
        });
        console.log(issuedata.issues);
    }

    const [viewIssues, setViewIssues] = useState(true);
    function toggleViewIssues(){
        setViewIssues(!viewIssues);
        var issueMenuLink = document.querySelector('.issueMenuLink');
        var currentClass = issueMenuLink.className;
        if(currentClass !== "issueMenuLink active"){
            issueMenuLink.className = "issueMenuLink active";
        } else {
            issueMenuLink.className = "issueMenuLink";
        }
    }
    return (
        <div className="issuecontent container">
            {
            responseMessage !== "" ? 
                <>
                    <div className="response-message">{responseMessage}<br/>
                    <span>To access the data, please login first</span></div>
                </>
            : 
                <>
                    <div className="issueHeader">
                        <div className="table-title dashboard-title">Recent Bugs</div>
                        <div className='issueMenu'>
                            <Link to="/issues" onClick={() => toggleViewIssues()} className="issueMenuLink">Create Issues</Link>
                        </div>
                    </div>

                    { !viewIssues ? <CreateIssue userDetails={userDetails} /> : null }
                    <ViewIssues />
                </>
            }
        </div>
    );
}

export default Issues;