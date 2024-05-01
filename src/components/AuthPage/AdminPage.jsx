import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import useLogout from '../../hooks/useLogout';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import $ from 'jquery';
import 'datatables.net';
import { formatDistanceToNow } from 'date-fns';

const AdminPage = () => {
    // context
    const { user } = useAuthContext();
    const logout = useLogout();
    const MySwal = withReactContent(Swal);
    const [getUsers, setGetUsers] = useState([]);

    useEffect(() => {
        if (user && user.isLoggedIn) {
            if (user.role !== 'admin') {
                // show alert
                MySwal.fire({
                    title: "Access Denied",
                    text: "You do not have access to this page",
                    icon: "error",
                    confirmButtonText: "Ok",
                }).then(() => {
                    // remove /admin from the url
                    // window.history.pushState({}, document.title, "/");
                    // pop the state
                    window.history.back();
                    logout();
                });
                return;
            }{
                fetch("http://localhost:3300/api/users")
                .then((res) => res.json())
                .then((data) => {
                    data.data.forEach((user) => {
                    user.updatedAt = formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true });
                    });
                    setGetUsers(data.data)
                });
            }
        }
    }, [user]);

    const editRole = (userId) => {
        MySwal.fire({
            title: "Edit Role",
            input: "select",
            inputOptions: {
                admin: "Admin",
                manager: "Manager",
            },
            showCancelButton: true,
            confirmButtonText: "Update",
            showLoaderOnConfirm: true,
            preConfirm: (role) => {
                fetch("http://localhost:3300/api/users/" + userId, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role }),
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === true) {
                        toast.success("Role updated successfully");
                    } else {
                        toast.error("Failed to update role");
                    }
                });
            },
        });
    };


    const [isUsersShown, setIsUsersShown] = useState(false);
    const showUsers = () => {
        if (!isUsersShown) {
            setIsUsersShown(true);
            $('#usersTable').DataTable({
                data: getUsers,
                columns: [
                    { data: 'username' , title: 'Username'},
                    { data: 'email' , title: 'Email'},
                    { title: 'Role', render: (data, type, row) => {
                        return (
                            `<div>${row.role}
                                <button class="btn btn-button adminEditBtn" data-id="${row._id}">
                                <span class="material-symbols-outlined">edit</span>
                                </button>
                            </div>`
                        )
                    }
                    },
                    { data: 'updatedAt' , title: 'Last Updated'}
                ]
            });
        }
    }

    useEffect(() => {
        if (isUsersShown) {
            $('#usersTable').on('click', 'button', function() {
                const userId = $(this).data('id');
                editRole(userId);
            });
        }
    }, [isUsersShown]);
    
    return (
        <div className='adminPage'>
            <ToastContainer />
            {user && user.role !== 'admin' ? null : <>
            <div className="commonEditHeader">
                <div className="table-title dashboard-title">Admin Page</div>
                <button className="btn btn-button" onClick={() => showUsers()}>Show Users</button>
            </div>
            <div className="commonEditBody">
                <table id="usersTable" className="display">
                </table>
            </div>
            </>}
        </div>
    )
}

export default AdminPage;