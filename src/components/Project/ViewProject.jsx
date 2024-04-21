import React from "react";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { useProjectContext } from "../../hooks/useProjectContext";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { formatDistanceToNow } from 'date-fns';

const ViewProject = () => {
    // context
    const { projects, dispatch } = useProjectContext();
    const { user } = useAuthContext();
    // navigate
    const navigate = useNavigate();

    const userId = user && user.isLoggedIn ? user.userId : "";
    // fetch all projects
    useEffect(() => {
        fetch("http://localhost:3300/api/projects/user/" + userId)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                data.data.forEach((project) => {
                    project.createdAt = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });
                    project.updatedAt = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });
                });
                dispatch({ type: "SET_PROJECTS", payload: data.data });
        });
    }, []);

    if (projects) {
        $("#projectTable").DataTable({
            data: projects,
            columns: [
                { data: "title", title: "Title" },
                { data: "description", title: "Description" },
                { data: "department", title: "Department" },
                { data: "updatedAt", title: "Updated At" },
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