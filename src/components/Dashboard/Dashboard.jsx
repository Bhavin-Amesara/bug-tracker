import React, { useEffect, useState } from "react";
import DashboardCard from "./DashBoardCard";
import "./Dashboard.scss";
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { formatDistanceToNow } from 'date-fns';


const Dashboard = ({ setDashboardData, activeDashboardItemLink }) => {
  // context
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const [getUsers, setGetUsers] = useState([]);
  const [getProjects, setGetProjects] = useState([]);
  const [getIssues, setGetIssues] = useState([]);
  const [getPublicIssues, setGetPublicIssues] = useState([]);
  useEffect(() => {
    if ( !user || !user.isLoggedIn ) return;
    if ( user && user.role !== "admin" ) return;
    fetch("http://localhost:3300/api/users")
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((user) => {
          user.updatedAt = formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true });
        });
        setGetUsers(data.data)
      });

    fetch("http://localhost:3300/api/projects")
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((project) => {
          project.updatedAt = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });
        });
        setGetProjects(data.data)});

    fetch("http://localhost:3300/api/issues")
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((issue) => {
          issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
        });
        setGetIssues(data.data)});

    fetch("http://localhost:3300/api/public-issues")
      .then((res) => res.json())
      .then((data) => {
        data.data.forEach((publicissue) => {
          publicissue.updatedAt = formatDistanceToNow(new Date(publicissue.updatedAt), { addSuffix: true });
        });
        setGetPublicIssues(data.data)});

    if(setDashboardData){
      setDashboardData({
        users: getUsers.length,
        projects: getProjects.length,
        issues: getIssues.length,
        publicIssues: getPublicIssues.length,
      })}
  }, []);

  useEffect(() => {
    if ( activeDashboardItemLink === "users" ) {
      setDataToTable("users", getUsers);
      setDashboardData({
        users: getUsers.length,
        projects: getProjects.length,
        issues: getIssues.length,
        publicIssues: getPublicIssues.length,
      });
    } else if ( activeDashboardItemLink === "projects" ) {
      setDataToTable("projects", getProjects);
      setDashboardData({
        users: getUsers.length,
        projects: getProjects.length,
        issues: getIssues.length,
        publicIssues: getPublicIssues.length,
      });
    } else if ( activeDashboardItemLink === "issues" ) {
      setDataToTable("issues", getIssues);
      setDashboardData({
        users: getUsers.length,
        projects: getProjects.length,
        issues: getIssues.length,
        publicIssues: getPublicIssues.length,
      });
    } else if ( activeDashboardItemLink === "public-issues" ) {
      setDataToTable("public-issues", getPublicIssues);
      setDashboardData({
        users: getUsers.length,
        projects: getProjects.length,
        issues: getIssues.length,
        publicIssues: getPublicIssues.length,
      });
    }
  }, [activeDashboardItemLink]);

  const setDataToTable = (title, data) => {
    if(title === "users"){
      $("#showContent").DataTable({
        data: data,
        columns: [
          { title: "Name", data: "username" },
          { title: "Email", data: "email" },
          { title: "Role", data: "role" },
          { title: "Last Seen", data: "updatedAt" },
        ],
        "bDestroy": true,
      });

    }else if(title === "projects"){
      $("#showContent").DataTable({
        data: data,
        columns: [
          { data: "title", title: "Title" },
          { data: "description", title: "Description" },
          { data: "department", title: "Department" },
          { data: "updatedAt", title: "Updated At" },
        ],
        "bDestroy": true,
      });
    }else if(title === "issues"){
      $("#showContent").DataTable({
        data: data,
        columns: [
          { title: "Title", data: "title" },
          { title: "Description", data: "description" },
          { title: "Project", data: "project_id.title" },
          { title: "Updated At", data: "updatedAt" },
        ],
        "bDestroy": true,
      });
    
    

    }
    
  }

  
  
  return (
    <div className="dashboard container">
      <div className="dashheader d-a-flex">
        <div className="dashname">Dashboard</div>
      </div>

      <div className="dashcontent">
        {/* <div className="countcards">
          <div className="dashboard-title">
            <div className="cardtitle">Bugs/Issues</div>
          </div>
          

        </div> */}
      { user && user.role === "admin" ?
        <div className="dashreport">
          <div className="reportcard">
            <div className="report-title dashboard-title">Reports</div>
            <div className="reportcontent d-a-flex">
              {/* <div className="reportGraphButton d-a-flex">
                <span id="users" className="btn btn-button active" onClick={() => {setDataToTable(activeDashboardItemLink, getUsers)}}>Users</span>
                <span id="projects" className="btn btn-button" onClick={() => {setDataToTable(activeDashboardItemLink, getProjects)}}>Projects</span>
                <span id="issues" className="btn btn-button" onClick={() => {setDataToTable(activeDashboardItemLink, getIssues)}}>Issues</span>
                <span id="pissues" className="btn btn-button" onClick={() => {setDataToTable(activeDashboardItemLink, getPublicIssues)}}>Public Bugs</span>
              </div> */}
              <div className="reportGraph">
                <div className="reportGraphItem">
                  <table id="showContent" className="table table-striped table-bordered"></table>
                </div>
              </div>
            </div>
          </div>
        
        </div>
        : null }
          
      </div>
    </div>
  );
};

export default Dashboard;
