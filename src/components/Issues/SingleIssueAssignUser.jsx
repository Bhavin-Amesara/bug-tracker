// Importing Required Libraries
import React, { useState, useEffect } from 'react';
// import { assignUser } from '../../hooks/useAssignUser';
import "./Issues.scss";
// import { users } from '../../data/users';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';

const SingleIssueAssignUser = ({ issue }) => {
    // const { user, dispatch } = useAssignUserContext();
    const { user } = useAuthContext();
    const userId = user && user.isLoggedIn ? user.userId : "";
    
    const [assignee, setAssignee] = useState(userId);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState("");
    const [issueId, setIssueId] = useState();
    const [status, setStatus] = useState("open");

    useEffect(() => {
        setIssueId(issue && issue._id);
    }, []);
    
    const handleAssigneeChange = (e) => {
        e.preventDefault();
        
        // to do: add the file upload functionality
        var formData = new FormData();
        formData.append('assigned_by', userId);
        formData.append('assignee', assignee);
        formData.append('description', description);
        formData.append('issueId', issueId);
        formData.append('status', status);
        for (let i = 0; i < file.length; i++) {
            formData.append('file', file[i]);
        }
        console.log(...formData, "from assign user form");
        
        // axios.post(`http://localhost:3300/api/issue-tracker`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        // .then((response) => {
        //     console.log(response);
        // })
        // .catch((error) => {
        //     console.log(error);
        // });

        fetch('http://localhost:3300/api/issue-tracker', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });

    }
}

export { SingleIssueAssignUser };