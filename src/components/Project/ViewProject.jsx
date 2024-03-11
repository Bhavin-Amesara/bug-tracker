import React from "react";
import DataTable from 'datatables.net';
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { useProjectContext } from "../../hooks/useProjectContext";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const ViewProject = () => {
    // context
    const { projects, dispatch } = useProjectContext();
    const { user } = useAuthContext();
    // navigate
    const navigate = useNavigate();

    const notify = (message) => toast(message);
    const userId = user && user.isLoggedIn ? user.userId : "";
    // fetch all projects
    useEffect(() => {
        fetch("api/projects/user/" + userId)
            .then((res) => res.json())
            .then((data) => {
                dispatch({ type: "SET_PROJECTS", payload: data.data });
        });
    }, [dispatch]);

    if (projects) {
        $("#projectTable").DataTable({
            data: projects,
            columns: [
                { data: "title", title: "Title" },
                { data: "description", title: "Description" },
                { data: "createdAt", title: "Created At" },
                { data: null, title: "View", render: function (data, type, row) {
                    return `<button class="btn-button" data-id="${data._id}">View</button>`;
                } },
            ],
            "bDestroy": true,
            "bAutoWidth": false,
        });

        $('#projectTable').on('click', 'button', function () {
            var data = $('#projectTable').DataTable().row($(this).parents('tr')).data();
            dispatch({ type: "SET_SINGLE_PROJECT", payload: data });
            console.log(data, "-----------------------------------------------");
            navigate(`/project/${data._id}`);
            // clear last 3 navigations from the history
            window.history.go(-3);
        });
    }


    return (
        <div>
            <ToastContainer />
            <table id="projectTable" className="display">
            </table>
        </div>
    );
}

export default ViewProject;