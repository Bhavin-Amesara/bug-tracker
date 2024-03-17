import React from 'react';
import './Sidebar.scss';
import { useLocation } from 'react-router-dom';
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ userName, setActiveIssueLink, setActiveProjectLink, setActiveSingleIssueLink, setActiveSingleProjectLink, setActiveBugzoneLink }) => {
    // get full route 
    const location = useLocation();
    // set active class for the current route
    const currentRoute = location.pathname.split('/')[1];
    // navigate
    const navigate = useNavigate();

    // handle click event for the sidebar menu
    const handleIssueClick = (props) => {
        if(props === 'viewIssues'){
            setActiveIssueLink('viewIssues');
            if(document.getElementById('issue-btn2')){
                document.getElementById('issue-btn2').classList.remove('active');
                document.getElementById('issue-btn1').classList.add('active');
            }
        } else if(props === 'createIssue'){
            setActiveIssueLink('createIssue');
            if(document.getElementById('issue-btn1')){
                document.getElementById('issue-btn1').classList.remove('active');
                document.getElementById('issue-btn2').classList.add('active');
            }
        } 
    }
    const handleSingleIssueClick = (props) => {
        if(props === 'singleIssueDetails'){
            setActiveSingleIssueLink('singleIssueDetails');
            if(document.getElementById('single-issue-btn2')){
                document.getElementById('single-issue-btn2').classList.remove('active');
                document.getElementById('single-issue-btn3').classList.remove('active');
                document.getElementById('single-issue-btn5').classList.remove('active');
                document.getElementById('single-issue-btn1').classList.add('active');
            }
        } else if(props === 'editSingleIssue'){
            setActiveSingleIssueLink('editSingleIssue');
            if(document.getElementById('single-issue-btn1')){
                document.getElementById('single-issue-btn1').classList.remove('active');
                document.getElementById('single-issue-btn3').classList.remove('active');
                document.getElementById('single-issue-btn5').classList.remove('active');                
                document.getElementById('single-issue-btn2').classList.add('active');
            }
        } else if(props === 'assignSingleIssue'){
            setActiveSingleIssueLink('assignSingleIssue');
            if(document.getElementById('single-issue-btn3')){
                document.getElementById('single-issue-btn1').classList.remove('active');
                document.getElementById('single-issue-btn2').classList.remove('active');
                document.getElementById('single-issue-btn5').classList.remove('active');
                document.getElementById('single-issue-btn3').classList.add('active');
            }
        } else if(props === 'viewIssue'){
            navigate('/issues');
            if(document.getElementById('single-issue-btn5')){
                document.getElementById('single-issue-btn1').classList.remove('active');
                document.getElementById('single-issue-btn2').classList.remove('active');
                document.getElementById('single-issue-btn3').classList.remove('active');
                document.getElementById('single-issue-btn5').classList.add('active');
            }
        }
    }
    const handleProjectClick = (props) => {
        if(props === 'viewProjects'){
            setActiveProjectLink('viewProjects');
            if(document.getElementById('project-btn2')){
                document.getElementById('project-btn2').classList.remove('active');
                document.getElementById('project-btn1').classList.add('active');
            }
        } else if(props === 'createProject'){
            setActiveProjectLink('createProject');
            if(document.getElementById('project-btn1')){
                document.getElementById('project-btn1').classList.remove('active');
                document.getElementById('project-btn2').classList.add('active');
            }
        } 
    }
    const handleSingleProjectClick = (props) => {
        if(props === 'singleProjectDetails'){
            setActiveSingleProjectLink('singleProjectDetails');
            if(document.getElementById('single-project-btn2')){
                document.getElementById('single-project-btn2').classList.remove('active');
                document.getElementById('single-project-btn3').classList.remove('active');
                document.getElementById('single-project-btn1').classList.add('active');
            }
        } else if(props === 'editSingleProject'){
            setActiveSingleProjectLink('editSingleProject');
            if(document.getElementById('single-project-btn1')){
                document.getElementById('single-project-btn1').classList.remove('active');
                document.getElementById('single-project-btn3').classList.remove('active');
                document.getElementById('single-project-btn2').classList.add('active');
            }
        } else if(props === 'addUserToProject'){
            setActiveSingleProjectLink('addUserToProject');
            if(document.getElementById('single-project-btn3')){
                document.getElementById('single-project-btn1').classList.remove('active');
                document.getElementById('single-project-btn2').classList.remove('active');
                document.getElementById('single-project-btn3').classList.add('active');
            }
        }
    }
    const handleBugzoneClick = (props) => {
        if(props === 'viewBugzone'){
            setActiveBugzoneLink('viewBugzone');
            if(document.getElementById('bugzone-btn3')){
                document.getElementById('bugzone-btn2').classList.remove('active');
                document.getElementById('bugzone-btn1').classList.remove('active');
                document.getElementById('bugzone-btn3').classList.add('active');
            }
        } else if(props === 'reportBugzone'){
            setActiveBugzoneLink('reportBugzone');
            if(document.getElementById('bugzone-btn1')){
                document.getElementById('bugzone-btn2').classList.remove('active');
                document.getElementById('bugzone-btn3').classList.remove('active');
                document.getElementById('bugzone-btn1').classList.add('active');
            }
        } else if(props === 'updateBugzone'){
            setActiveBugzoneLink('updateBugzone');
            if(document.getElementById('bugzone-btn2')){
                document.getElementById('bugzone-btn1').classList.remove('active');
                document.getElementById('bugzone-btn3').classList.remove('active');
                document.getElementById('bugzone-btn2').classList.add('active');
            }
        }
    }

    // handle click event for the theme toggle
    const handleThemeClick = (props) => {
        if(props === 'sunlight'){
            document.documentElement.classList.remove('dark-theme');
            document.querySelector('.themeToggleBtnItem.active').classList.remove('active');
            document.querySelector('.themeToggleBtnItem').classList.add('active');
        } else if(props === 'moonlight'){
            document.documentElement.classList.add('dark-theme');
            document.querySelector('.themeToggleBtnItem.active').classList.remove('active');
            document.querySelector('.themeToggleBtnItem:last-child').classList.add('active');
        }
    }
    
    return (
        <div className="sidebar">
            <div className="user-info">
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.00002 21.8174C4.6026 22 5.41649 22 6.8 22H17.2C18.5835 22 19.3974 22 20 21.8174M4.00002 21.8174C3.87082 21.7783 3.75133 21.7308 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H17.2C18.8802 2 19.7202 2 20.362 2.32698C20.9265 2.6146 21.3854 3.07354 21.673 3.63803C22 4.27976 22 5.11984 22 6.8V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C20.2487 21.7308 20.1292 21.7783 20 21.8174M4.00002 21.8174C4.00035 21.0081 4.00521 20.5799 4.07686 20.2196C4.39249 18.6329 5.63288 17.3925 7.21964 17.0769C7.60603 17 8.07069 17 9 17H15C15.9293 17 16.394 17 16.7804 17.0769C18.3671 17.3925 19.6075 18.6329 19.9231 20.2196C19.9948 20.5799 19.9996 21.0081 20 21.8174M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="user-name">{userName}</div>
            </div>
            <div className="sidebarMenu">
                <div className="sidebarMenuItems">
                    <div className="sidebarMenuItem">
                        <NavLink to="/" className="btn-sidebar-button">Dashboard</NavLink>
                    </div>
                </div>
            </div>            
            {
                currentRoute === 'issue' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <div className="sidebarMenuItem">
                            <span className="sidebarMenuItemsGroup">Single Issues</span>
                            <button id="single-issue-btn1" className="btn-sidebar-button active" onClick={() => handleSingleIssueClick("singleIssueDetails")}>Issue Details</button>
                            <button id="single-issue-btn2" className="btn-sidebar-button" onClick={() => handleSingleIssueClick("editSingleIssue")}>Edit Issue</button>
                            <button id="single-issue-btn3" className="btn-sidebar-button" onClick={() => handleSingleIssueClick("assignSingleIssue")}>Assign Issue</button>
                        </div>
                        <div className="sidebarMenuItem">
                            <span className="sidebarMenuItemsGroup">Issues</span>
                            <button id="single-issue-btn5" className="btn-sidebar-button" onClick={() => handleSingleIssueClick("viewIssue")}>View Issue</button>
                        </div>
                    </div>
                </div>
                : currentRoute === 'issues' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">Issues</span>
                        <button id="issue-btn1" className="btn-sidebar-button active" onClick={() => handleIssueClick("viewIssues")}>View Issues</button>
                        <button id="issue-btn2" className="btn-sidebar-button" onClick={() => handleIssueClick("createIssue")}>Create Issue</button>
                    </div>
                </div>
                : currentRoute === 'projects' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">Projects</span>
                        <button id="project-btn1" className="btn-sidebar-button active" onClick={() => handleProjectClick("viewProjects")}>View Projects</button>
                        <button id="project-btn2" className="btn-sidebar-button" onClick={() => handleProjectClick("createProject")}>Create Project</button>
                    </div>
                </div>
                : currentRoute === 'project' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">Single Project</span>
                        <button id="single-project-btn1" className="btn-sidebar-button active" onClick={() => handleSingleProjectClick("singleProjectDetails")}>Project Details</button>
                        <button id="single-project-btn2" className="btn-sidebar-button" onClick={() => handleSingleProjectClick("editSingleProject")}>Edit Project</button>
                        <button id="single-project-btn3" className="btn-sidebar-button" onClick={() => handleSingleProjectClick("addUserToProject")}>Assign Project</button>
                    </div>
                </div>
                : currentRoute === 'users' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">Users</span>
                        <button className="btn-sidebar-button active">View Users</button>
                        <button className="btn-sidebar-button">Create User</button>
                    </div>
                </div>
                : currentRoute === 'settings' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">Settings</span>
                        <button className="btn-sidebar-button active">General</button>
                        <button className="btn-sidebar-button">Profile</button>
                    </div>
                </div>
                : currentRoute === 'bugzone' ?
                <div className="sidebarMenu">
                    <div className="sidebarMenuItems">
                        <span className="sidebarMenuItemsGroup">BugZones</span>
                        <button id="bugzone-btn1" className="btn-sidebar-button active" onClick={() => handleBugzoneClick("reportBugzone")}>Report Bug</button>
                        <button id="bugzone-btn2" className="btn-sidebar-button" onClick={() => handleBugzoneClick("updateBugzone")}>Update Bug</button>
                        <button id="bugzone-btn3" className="btn-sidebar-button" onClick={() => handleBugzoneClick("viewBugzone")}>View All Bug</button>
                    </div>
                </div>
                : null
            }
            {/* color theme toggle */}
            <div className="themeToggle">
                <div className="themeToggleBtn">
                    <button className="themeToggleBtnItem active" onClick={() => handleThemeClick("sunlight")}>
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="h-full w-full"><rect x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paint-order="stroke"></rect><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><path d="M12 3V2m0 20v-1m9-9h1M2 12h1m15.5-6.5L20 4M4 20l1.5-1.5M4 4l1.5 1.5m13 13L20 20"/><circle cx="12" cy="12" r="4"/></g></g></svg></svg>
                    </button>
                    <button className="themeToggleBtnItem" onClick={() => handleThemeClick("moonlight")}>            
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="h-full w-full"><rect x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paint-order="stroke"></rect><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M11.486 4.768a7.25 7.25 0 1 0 7.399 9.51a6.25 6.25 0 0 1-7.398-9.51ZM3.25 12a8.75 8.75 0 0 1 10.074-8.65a.75.75 0 0 1 .336 1.342a4.75 4.75 0 1 0 5.83 7.499a.75.75 0 0 1 1.22.654A8.751 8.751 0 0 1 3.25 12Z" clip-rule="evenodd"/></g></svg></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;