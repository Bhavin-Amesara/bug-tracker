import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useProjectContext } from '../../hooks/useProjectContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SingleProjectEdit = () => {
    // context
    const { user } = useAuthContext();
    const { singleProject, dispatch } = useProjectContext();
    // sweetalert2 
    const MySwal = withReactContent(Swal);

    const { id } = useParams();
    // const [project, setProject] = useState(null);
    const navigate = useNavigate();
    
    const [updateVisibility, setUpdateVisibility] = useState(singleProject?.visibility);
    const [updateDepartment, setUpdateDepartment] = useState(singleProject?.department);
    const [updateDescription, setUpdateDescription] = useState(singleProject?.description);
    const [projectIssues, setProjectIssues] = useState([]);
    const [projectIssuesTracker, setProjectIssuesTracker] = useState([{}]);
    const [projectUsers, setProjectUsers] = useState([]);

    // toogle state
    const [editDepartment, setEditDepartment] = useState(false);
    const [editVisibility, setEditVisibility] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3300/api/projects/' + id)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === false) {
                    navigate('/projects');
                }
                data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });
                data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });
                // setProject(data.data);
                dispatch({ type: "SET_SINGLE_PROJECT", payload: data.data });
                setUpdateVisibility(data.data.visibility);
                setUpdateDepartment(data.data.department);
                setUpdateDescription(data.data.description);
            });

        fetch('http://localhost:3300/api/issues/project/' + id)
            .then((res) => res.json())
            .then((data) => {
                setProjectIssues(data.data);
            });

        fetch('http://localhost:3300/api/issue-tracker/project/' + id)
            .then((res) => res.json())
            .then((data) => {
                setProjectIssuesTracker(data.data);
            });

        fetch('http://localhost:3300/api/projects/users/' + id)
            .then((res) => res.json())
            .then((data) => {
                setProjectUsers(data.data);
            });
    }, [dispatch]);
    
    const handleFormUpdate = (e) => {
        e.preventDefault();
        setUpdateDepartment(document.getElementById('department').value);
        setUpdateVisibility(document.getElementById('visibility').value);
        setUpdateDescription(document.getElementById('description').value);

        fetch(`http://localhost:3300/api/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                last_updated_by: user.id,
                visibility: updateVisibility,
                department: updateDepartment,
                description: updateDescription
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == true) {
                toast.success(data.message);
                setUpdateVisibility(data.data.visibility);
                setUpdateDepartment(data.data.department);
                setUpdateDescription(data.data.description);
                data.data.createdAt = formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true });
                data.data.updatedAt = formatDistanceToNow(new Date(data.data.updatedAt), { addSuffix: true });
                dispatch({ type: "UPDATE_PROJECT", payload: data.data });
                dispatch({ type: "SET_SINGLE_PROJECT", payload: data.data });
                console.log(singleProject);
            } else {
                toast.error(data.message);
            }
        })
        .catch((err) => {
            toast.error("Failed to update project");
        });
    }

    const handleFormDelete = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this project!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProject();
            }
        });
    }

    const deleteProject = () => {
        fetch(`http://localhost:3300/api/projects/${id}`, {
            method: 'DELETE'
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === true && data.statusCode === 200) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your project has been deleted.',
                    icon: 'success',
                }).then(() => {
                    navigate('/projects');
                });
            } else {
                toast.error(data.message);
            }
        })
        .catch((err) => {
            toast.error("Failed to delete project");
        });
    }



    return (
        <div className="singleCommonEdit">
            <div className="commonEditHeader">
                <div className="table-title dashboard-title">Edit Project Details</div>
            </div>
            <div className="commonEditDetails">
                <div className="commonEditActualContent">
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Title</div>
                    <div className="commonEditDetailsValue">{singleProject?.title}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Created By</div>
                    <div className="commonEditDetailsValue">{singleProject?.created_by?.username}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Lead By</div>
                    <div className="commonEditDetailsValue">{singleProject?.lead.username}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Updated At</div>
                    <div className="commonEditDetailsValue">{singleProject?.updatedAt}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Created At</div>
                    <div className="commonEditDetailsValue">{singleProject?.createdAt}</div>
                </div>
                <div className="commonEditDetailsItem">
                    <div className="commonEditDetailsLabel">Last Updated By</div>
                    <div className="commonEditDetailsValue">{singleProject?.last_updated_by?.username}</div>
                </div>
                </div>
                <div className="commonEditEditContent">
                    <form className="commonEditDetailsForm">
                        <div className="commonEditDetailsItem">
                            <div className="commonEditDetailsLabel">Visibility</div>
                            <div className="commonEditControls d-flex">
                                <select name="visibility" id="visibility" required className='commonEditDetailsValue' value={updateVisibility} disabled={editVisibility?false:true} onChange={(e) => setUpdateVisibility(e.target.value)}>
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                </select>
                                <span className={editVisibility?"material-symbols-outlined active":"material-symbols-outlined"}
                                    onClick={() => setEditVisibility(!editVisibility)}
                                >edit</span>
                            </div>
                        </div>
                        <div className="commonEditDetailsItem">
                            <div className="commonEditDetailsLabel">Department</div>
                            <div className="commonEditControls d-flex">
                            <select className="commonEditDetailsValue" id="department" value={updateDepartment} name="department" disabled={editDepartment?false:true} onChange={(e) => setUpdateDepartment(e.target.value)}>
                                <option value="general">General</option>
                                <option value="UI">UI</option>
                                <option value="backend">Backend</option>
                                <option value="database">Database</option>
                                <option value="testing">Testing</option>
                                <option value="security">Security</option>
                            </select>
                            <span className={editDepartment?"material-symbols-outlined active":"material-symbols-outlined"}
                                onClick={() => setEditDepartment(!editDepartment)}
                            >edit</span>
                            </div>
                        </div>
                        <div className="commonEditDetailsItemDesc d-flex">
                            <textarea
                                className="commonEditDetailsValue" 
                                name="description" id="description"
                                placeholder="Enter project description"
                                value={updateDescription}
                                disabled={editDescription?false:true}
                                onChange={(e) => setUpdateDescription(e.target.value)}
                            />
                            <span className={editDescription?"material-symbols-outlined active":"material-symbols-outlined"}
                                onClick={() => setEditDescription(!editDescription)} 
                            >edit</span>
                        </div>
                        <div className="commonEditDetailsItem">
                            <div className="commonEditActions">
                                <button className="btn-button save" type="submit" onClick={handleFormUpdate}>Update</button>
                                <button className="btn-button delete" type="button" onClick={handleFormDelete}>Delete</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SingleProjectEdit;