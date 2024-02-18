import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import DataTable from 'datatables.net';
import { useIssueContext } from "../../hooks/useIssueContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';


const ViewIssues = () => {

    const { issues, dispatch } = useIssueContext();
    
    useEffect(() => {
        fetch("api/issues")
        .then((response) => response.json())
        .then((response) => {
            // change format of date to DD/MM/YYYY
            // response.data.forEach((issue) => {
            //     var date = new Date(issue.updatedAt);
            //     var formattedDate = (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
            //     issue.updatedAt = formattedDate;
            // });

            // use date-fns to format date
            response.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
            });

            dispatch({ type: "SET_ISSUES", payload: response.data });
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

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
                { data: "project_id.title", title: "Project" },
                { data: "created_by.username", title: "Created By" }, // "created_by": "username",
                { data: "status", title: "Status" },
                { data: "priority", title: "Priority" },
                { data: "updatedAt", title: "Updated At" },
            ],
            "order": [[ 5, "desc" ]],
            "bDestroy": true,
            "bAutoWidth": false,
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
        });
    }

    return (
        <div className="issueTracker">
            <>
                <div className="issueTable">
                    <table id="issuesTable" className="display">
                    </table>
                </div>
            </>
        </div>
    );
};

export default ViewIssues;