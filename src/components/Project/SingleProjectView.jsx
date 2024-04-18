import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import SingleProjectEdit from "./SingleProjectEdit";
import SingleProjectDetailPage from "./SingleProjectDetailPage";
import SingleProjectActions from "./SingleProjectActions";

const SingleProjectView = ({ activeSingleProjectLink }) => {
    // context
    const { user } = useAuthContext();    
    return (
        <>
            <div className="container">
                <div className="projectHeader">
                    <div className="backButton">
                        <Link to="/projects"> 
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> Back </Link>
                    </div>
                    <div className='projectMenu'>
                    </div>
                </div>
            <ToastContainer />
            <div className="singleProjectView inner-container d-flex d-flex-column">
            { activeSingleProjectLink === 'singleProjectDetails' ? 
                <SingleProjectDetailPage />
            : activeSingleProjectLink === 'editSingleProject' ? 
                <>{ user.role === "admin" || user.role === 'manager'? <SingleProjectEdit /> : <div className="inner-container assignUserToProject"><h3>You are not authorized to create a project</h3></div>}</>
            : activeSingleProjectLink === 'addUserToProject' ? 
                <>
                    <SingleProjectActions />
                </>
            : null }
                
            </div>
            </div>
        </>
    );
    }

export default SingleProjectView;