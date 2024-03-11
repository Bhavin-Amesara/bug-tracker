import React, { useState } from "react";
import "./Project.scss";
import ViewProject from "./ViewProject";
import CreateProject from "./CreateProject";
import { useAuthContext } from "../../hooks/useAuthContext";

const Project = ({ activeProjectLink }) => {
    // context
    const { user } = useAuthContext();

    console.log(activeProjectLink);

    return (
        <div className="projectcontent container">
            <div className="projectHeader">
                { activeProjectLink === 'viewProjects' ? <div className="table-title dashboard-title">Recent Projects</div> : null }
            </div>
            <div className="projectContent">
                {
                    activeProjectLink === 'viewProjects' ? <ViewProject /> :
                    activeProjectLink === 'createProject' ?
                    user.isLoggedIn && (user.role === "admin" || user.role === "manager") ?
                        <CreateProject />
                        : <div className="alert alert-danger">You are not authorized to create a project</div>
                    : null
                }
            </div>
        </div>
    );
    }

export default Project;