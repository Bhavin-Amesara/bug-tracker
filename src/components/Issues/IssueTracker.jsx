import React from 'react';
import { useState, useEffect } from 'react';
import DataTable from 'datatables.net';
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { formatDistanceToNow } from 'date-fns';
import $ from 'jquery';
import { useIssueTrackerContext } from '../../hooks/useIssueTrackerContext';

const IssueTracker = ({ issueId }) => {

    // context api
    const { dispatch, issuesTracker } = useIssueTrackerContext();

    // fetch issue tracker
    const [issueTrackerMessage, setIssueTrackerMessage] = useState({});
    useEffect(() => {
        fetch("http://localhost:3300/api/issue-tracker/" + issueId)
        .then((response) => response.json())
        .then((response) => {
            console.log(response, "response from issue tracker path: components/Issues/IssueTracker.jsx");
            // use date-fns to format date
            response.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });
            if ( response.data.length === 0 ) {
                setIssueTrackerMessage(response.message || "No issue tracker found.");
                return;
            }
            dispatch({ type: "SET_ISSUES_TRACKER", payload: response.data });
        })
        .catch((error) => {
            console.log(error, "error from issue tracker path: components/Issues/IssueTracker.jsx");
        });
    }, [dispatch]);

    // delete issue tracker
    $('#issuesTrackerTable').on('click', 'button', function() {
        const issueTrackerId = $(this).data("id");
        fetch("http://localhost:3300/api/issue-tracker/" + issueTrackerId, {
            method: "DELETE",
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response, "response from issue tracker delete path: components/Issues/IssueTracker.jsx");
            if (response.status === "success") {
                dispatch({ type: "DELETE_ISSUE_TRACKER", payload: issueTrackerId });
                dispatch({ type: "UPDATE_ISSUE_TRACKER", payload: response.data });
                dispatch({ type: "SET_ISSUE_TRACKER", payload: response.data });
            }
        })
        .catch((error) => {
            console.log(error, "error from issue tracker delete path: components/Issues/IssueTracker.jsx");
        });
    });


    if(issuesTracker !== null && issuesTracker !== undefined){
        $("#issuesTrackerTable").DataTable({
            data: issuesTracker,
            columns: [
                { title: "Assigned To", data: "assigned_to.username" },
                { title: "Status", data: "status" },
                { title: "Comment", data: "comment" , "render" : function(data, type, row) {
                    return data.length > 15 ? data.substr(0, 15) + '…' : data;
                } },
                { title: "Updated At", data: "updatedAt" },
                { title: "Delete", data: null, "render": function (data, type, row) {
                    return `<button class="btn-button d-flex" data-id="${data._id}">
                    <svg width="186px" viewBox="0 0 24 24" fill="#3A76F5" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="#3A76F5"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78L4 6Zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6l1.345-2.853ZM2 6h20m-12 5v5m4-5v5"/></g></svg>
                    </button>`;
                } },
            ],
            "order": [[ 2, "Updated At" ]],
            "bDestroy": true,
            "bAutoWidth": false,
        });
    }


  
  return (
    <div style={{minWidth: "55%"}} >
        <div className="singleIssueTracker">
            <div className="issueHeader">
                <div className="table-title dashboard-title">Issue Tracker</div>
            </div>
            <div className="issueTable">
                <table id="issuesTrackerTable" className="display"></table>
            </div>
        </div>
    </div>
  )
}

export { IssueTracker };