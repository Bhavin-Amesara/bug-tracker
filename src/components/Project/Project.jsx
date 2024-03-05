import React, { useState } from "react";
import "./Project.scss";
import ViewProject from "./ViewProject";
import CreateProject from "./CreateProject";

const Project = () => {
    // handle three views: view projects, create project
    const [view, setView] = useState('viewProjects');

    // set active class for the view
    const handleActive = (props) => {
        if(props === 'viewProjects'){
            setView('viewProjects');
            document.getElementById('createProject').classList.remove('active');
            document.getElementById('viewProject').classList.add('active');
        } else if(props === 'createProject'){
            setView('createProject');
            document.getElementById('viewProject').classList.remove('active');
            document.getElementById('createProject').classList.add('active');
        }
    }

    return (
        <div className="projectcontent container">
            <div className="projectHeader">
                <div className="table-title dashboard-title">Recent Bugs</div>
                <div className='projectMenu'>
                    <button id="viewProject" className="btn-button active" onClick={() => {handleActive('viewProjects');}}>View Project</button>
                    <button id="createProject" className="btn-button" onClick={() => {handleActive('createProject');}}>Create Project</button>
                </div>
            </div>
            <div className="projectContent">
                {
                    view === 'viewProjects' ? <ViewProject /> : 
                    view === 'createProject' ? <CreateProject /> : null
                }
            </div>
        </div>
    );
    }

export default Project;