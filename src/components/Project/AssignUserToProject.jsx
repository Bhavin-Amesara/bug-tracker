import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Multiselect from 'multiselect-react-dropdown';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from 'react-toastify';


const AssignUserToProject = ({projectName}) => {
    // context
    const { user } = useAuthContext();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedUserNames, setSelectedUserNames] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);
    const tempId = useParams().id.toString();

    useEffect(() => {
        fetch('http://localhost:3300/api/projects/users/' + tempId)
        .then((res) => res.json())
        .then((data) => {
            setProjectUsers(data.data);
        });

        fetch('http://localhost:3300/api/users/role/developer-manager')
        .then(res => res.json())
        .then((data) => {
            projectUsers.forEach(user => {
                data.data = data.data.filter(u => u._id !== user.userId._id);
            });
            setUsers(data.data.map(user => {
                return {
                    label: user.username,
                    value: user._id
                }
            }));
        });
    }, [projectName]);

    const setMultiselectValue = (selectedList, selectedItem) => {
        setSelectedUser(selectedList);
        setSelectedUserNames(selectedList.map(user => user.label));
    }

    const removeUser = (selectedList, removedItem) => {
        setSelectedUser(selectedList);
        setSelectedUserNames(selectedList.map(user => user.label));
    }

    const assignUserToProject = (e) => {
        e.preventDefault();
        const users = selectedUser;
        const assignedBy = {
            userId: user.userId,
            username: user.username,
            email: user.email
        }
        const data = { users, assignedBy };

        fetch(`http://localhost:3300/api/projects/${tempId}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === false) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
        })
        .catch(err => {
            toast.error("Failed to assign user to project");
        });
    }

    return (
        <div className="inner-container assignUserToProject">
            <ToastContainer />
            <div className="table-title dashboard-title"><span>Add User to Project</span> "{projectName}"</div>
            <form className='assignUserToProjectForm' onSubmit={assignUserToProject}>
                <div className="form-group">
                    <label htmlFor="user">Select User</label>
                    <Multiselect
                        options={users}
                        displayValue="label"
                        onSelect={(selectedList, selectedItem) => setMultiselectValue(selectedList, selectedItem)}
                        onRemove={(selectedList, removedItem) => removeUser(selectedList, removedItem)}
                        isObject={true}
                    />
                </div>
                <button type="submit" className="btn btn-button">Assign User</button>
            </form>
        </div>
    )   
}

export default AssignUserToProject