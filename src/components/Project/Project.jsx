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
        <div className={ activeProjectLink === 'viewProjects' ? "projectcontent container" : "projectcontent inner-container" }>
            { activeProjectLink === 'viewProjects' ?
                <div className="projectHeader">
                    <div className="table-title dashboard-title">Recent Projects</div> 
                </div>
            : null }
            <div className="projectContent">
                {
                    activeProjectLink === 'viewProjects' ? <ViewProject /> :
                    activeProjectLink === 'createProject' ?
                    user.isLoggedIn && (user.role === "admin" || user.role === "manager") ?
                        <CreateProject />
                        : 
                        <div className="errorPage">
                            <h2>You are not authorized to create a project</h2>
                            <p>Only Admins and Managers can create projects</p>
                        </div>
                    : null
                }
            </div>
        </div>
    );
    }

export default Project;