import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import DataTable from 'datatables.net';
import { useIssueContext } from "../../hooks/useIssueContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useNavigate } from "react-router-dom";


const ViewIssues = () => {
    // context
    const { issues, dispatch} = useIssueContext();
    // navigate
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch("api/issues")
        .then((response) => response.json())
        .then((response) => {
            // use date-fns to format date
            response.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });
            
            dispatch({ type: "SET_ISSUES", payload: response.data });
        })
        .catch((error) => {
            console.log(error);
        });
    }, [dispatch]);
    

    if(issues !== null && issues !== undefined){
        $('#issuesTable').DataTable({
            data: issues,
            columns: [
                { data: "title", title: "Title", "render" : function(data, type, row) {
                    return data.length > 15 ? data.substr(0, 15) + '…' : data;
                } },
                // { data: "description", title: "Description", "width": "30%", "render": function (data, type, row) {
                //     return data.length > 20 ? data.substr(0, 20) + '…' : data;
                // } },
                // hidden id column
                { data: "_id", title: "ID", "visible": false },
                { data: "project_id.title", title: "Project" },
                { data: "created_by.username", title: "Created By" }, // "created_by": "username",
                { data: "status", title: "Status" },
                { data: "priority", title: "Priority" },
                { data: "updatedAt", title: "Updated At" },
                { data: null, title: "View", "render": function (data, type, row) {
                    return `<button class="btn-button " data-id="${data._id}">View</button>`;
                } },           
            ],
            "order": [[ 5, "desc" ]],
            "bDestroy": true,
            "bAutoWidth": false,
        });
    }
    
    $('#issuesTable').on('click', 'button', function() {
        var id = $(this).data('id');
        viewIssue(id);
    });
    
    function viewIssue(id) {
        // redirect to single issue view
        // navigate(`/issue/${id}`); instead of this, use the following:- useNavigate hook
        navigate(`/issue/${id}`);
    }
    
    
    return (
        <div className="issueTracker">
            <>
                <div className="issueTable">
                    <table id="issuesTable" className="display"></table>
                </div>
            </>
        </div>
    );
};

export default ViewIssues;