import './Issues.scss';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import DataTable from 'datatables.net';

const Issues = () => {
    // const [userdata, setuserData] = useState([{}]);
    const [issuedata, setissueData] = useState([{}]);
    const [issueTracker, setIssueTracker] = useState([{}]);
    var random = "nitish";
    
    useEffect(() => {
        fetch("api/issues")
        .then((response) => response.json())
        .then((data) => {
            setissueData(data);
        })
    }, [random]);

    useEffect(() => {
        fetch("api/issue-tracker")
        .then((response) => response.json())
        .then((data) => {
            setIssueTracker(data);
        })
    }, [random]);

    console.log(issuedata.issues);
    console.log(issueTracker.issueTracker);

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

    return (
        <div className="dashcontent container">
            <div className="table">
                <div className="table-title dashboard-title">Recent Bugs</div>
                <table id="table_id" className="display">
                </table>
            </div>
        </div>
    );
}

export default Issues;