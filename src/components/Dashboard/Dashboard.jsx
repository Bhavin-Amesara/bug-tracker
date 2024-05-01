import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import $ from 'jquery';
import 'datatables.net';
import { formatDistanceToNow } from 'date-fns';
import { Pie, Bar, Line } from 'react-chartjs-2';
import UpdateAssignIssue from "./Developer/UpdateAssignIssue";

const Dashboard = ({ setDashboardData, activeDashboardItemLink }) => {
  // context
  const { user } = useAuthContext();
  const [getUsers, setGetUsers] = useState([]);
  const [getProjects, setGetProjects] = useState([]);
  const [getIssues, setGetIssues] = useState([]);
  const [getPublicIssues, setGetPublicIssues] = useState([]);
  const [issueTracker, setIssueTracker] = useState([]);
  const [issueTrackerReview, setIssueTrackerReview] = useState([]);
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
    if ( !user || !user.isLoggedIn ) return;
    if ( user && user.role === "admin" ) {
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
    } else {
      // setDataToTable("users", getUsers);
      // setDashboardData({
      //   users: getUsers.length,
      //   projects: getProjects.length,
      //   issues: getIssues.length,
      //   publicIssues: getPublicIssues.length,
      // });
    }}else if ( user && user.role === "developer" || user.role === "manager") {
      console.log(user.userId, "role");
      if ( activeDashboardItemLink === "assigned-issue" ) {
        try {
          fetch('http://localhost:3300/api/issue-tracker/user/' + user.userId)
          .then(res => res.json())
          .then(data => {
            if (data.status === true){
              data.data = data.data.filter(issue => issue.issue_id !== null);
              data.data.forEach((issue) => {
                issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
              });
              setIssueTracker(data.data);
            }
          });
        } catch (error) {
            console.log(error);
        }
      } else if ( activeDashboardItemLink === "reviews" ) {
        try {
          fetch('http://localhost:3300/api/issue-tracker/user/' + user.userId + '/reviews')
          .then(res => res.json())
          .then(data => {
            if (data.status === true){
              console.log(data.data, "reviews");
              data.data = data.data.filter(review => review.review_id !== null);
              data.data.forEach((review) => {
                review.updatedAt = formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true });
                review.createdAt = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });
              });
              setIssueTrackerReview(data.data);
              setIssueTrackerDataById([]);
            }
          });
        
        } catch (error) {
            console.log(error);
        }
      }
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
    }else if(title === "public-issues"){
      $("#showContent").DataTable({
        data: data,
        columns: [
          { title: "Title", data: "title" },
          { title: "Description", data: "description" },
          { title: "Creator", data: "created_by.username" },
          { title: "Updated At", data: "updatedAt" },
        ],
        "bDestroy": true,
      });
      
    }

  }

  const [selectTopic, setSelectTopic] = useState();
  const [selectGraph, setSelectGraph] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [borderColor, setBorderColor] = useState();
  const [isGraphActive, setIsGraphActive] = useState(false);
  const plotGraph = (topic) => {
    setSelectTopic(topic);
    setIsGraphActive(true);
    if(topic === "Issues"){
      document.getElementById("issues").classList.add("active");
      document.getElementById("projects").classList.remove("active");
      var getLabels = getIssues.map((issue) => issue.status);
      // unique labels
      getLabels = [...new Set(getLabels)];
      // background color
      setBackgroundColor(getLabels.map((label) => generateRandomColor()));     
      setBorderColor(getLabels.map((label) => generateBorderColor()));
      var getDatasets = getIssues.map((issue) => issue.status);
      var resolved = getDatasets.filter((status) => status === "resolved").length;
      var open = getDatasets.filter((status) => status === "open").length;
      var inProgress = getDatasets.filter((status) => status === "in-progress").length;
      // map labels to datasets to get the count of each status use getLabels order
      getDatasets = getLabels.map((label) => {
        if(label === "resolved"){
          return resolved;
        }else if(label === "open"){
          return open;
        }else if(label === "in-progress"){
          return inProgress;
        }
      });
      setSelectGraph({
        labels: getLabels,
        datasets: getDatasets,
      });
      console.log(selectGraph, "issues");
  }
  else if(topic === "Projects"){
    document.getElementById("projects").classList.add("active");
    document.getElementById("issues").classList.remove("active");
    var getLabels = getProjects.map((project) => project.department);
    // unique labels
    getLabels = [...new Set(getLabels)];
    // background color
    setBackgroundColor(getLabels.map((label) => generateRandomColor()));
    setBorderColor(getLabels.map((label) => generateBorderColor()));

    var getDatasets = getProjects.map((project) => project.department);
    var security = getDatasets.filter((department) => department === "security").length;
    var backend = getDatasets.filter((department) => department === "backend").length;
    var general = getDatasets.filter((department) => department === "general").length;
    var database = getDatasets.filter((department) => department === "database").length;
    var testing = getDatasets.filter((department) => department === "testing").length;
    var ui = getDatasets.filter((department) => department === "UI").length;
    
    // map labels to datasets to get the count of each status use getLabels order
    getDatasets = getLabels.map((label) => {
      if(label === "security"){
        return security;
      }else if(label === "backend"){
        return backend;
      }else if(label === "general"){
        return general;
      }else if(label === "database"){
        return database;
      }else if(label === "testing"){
        return testing;
      }else if(label === "UI"){
        return ui;
      }
    });
    setSelectGraph({
      labels: getLabels,
      datasets: getDatasets,
    });
    console.log(selectGraph, "projects");
  }
  }

  const generateRandomColor = () => {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);        
    return "#" + randomColor;
  }

  const generateBorderColor = () => {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
  }

  // const developerIssueTracker = () => {
  //   document.getElementById("dash-issues-tracker").classList.add("active");
  //   try {
  //       fetch('http://localhost:3300/api/issue-tracker/user/' + user.userId)
  //       .then(res => res.json())
  //       .then(data => {
  //           if (data.status === true){
  //               data.data = data.data.filter(issue => issue.issue_id !== null);
  //               data.data.forEach((issue) => {
  //                 issue.updatedAt = formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true });
  //               });
  //               setIssueTracker(data.data, "assigned issue fetched successfully for developer");
  //           }
  //       });
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  const [issueTrackerDataById, setIssueTrackerDataById] = useState([]);
  const openIssueTracker = (key, issue) => {
    setIssueTrackerDataById(issue);
    var buttons = document.querySelectorAll('.dashItemBtn');
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
    document.getElementById(key).classList.add("active");
  }
  
  return (
    <div className="dashboard container">
      { user && user.isLoggedIn ?
      <div className="dashheader d-a-flex">
        <div className="dashname">Dashboard</div>
      </div>
      : null}
      <div className="dashcontent">
      { user && user.isLoggedIn ? user.role === "admin" ?
        <div className="dashreport">
          <div className="graphList">
            <button id="issues" className="btn btn-button graphItemBtn" onClick={() => plotGraph("Issues")}>Issues Graph</button>
            <button id="projects" className="btn btn-button graphItemBtn" onClick={() => plotGraph("Projects")}>Projects Graph</button>
          </div>
          <div className="graphCard">
            <div className="dashboard-title">{selectTopic} Graph</div>
            {!isGraphActive ? <div className="fs-normal d-a-flex">No data available or you may click on the graph button</div> :
            <div className="graphcontent d-a-flex">
              <div className="graphPlot">
                <div className="c">
                  <Bar
                    data={{
                      labels: selectGraph && selectGraph.labels,
                      datasets: [
                        {
                          label: selectTopic,
                          data: selectGraph && selectGraph.datasets,
                          backgroundColor: backgroundColor && backgroundColor,
                          borderColor: borderColor && borderColor,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false,
                      scales: {y: {beginAtZero: true,},},
                    }}
                  />
                </div>
                <div className="graphPlotItem">
                  <Pie
                    data={{
                      labels: selectGraph && selectGraph.labels,
                      datasets: [
                        {
                          label: selectTopic,
                          data: selectGraph && selectGraph.datasets,
                          backgroundColor: backgroundColor && backgroundColor,
                          borderColor: borderColor && borderColor,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{maintainAspectRatio: false,
                      scales: {y: {beginAtZero: true,},},
                    }}
                  />
                </div>
                {/* <div className="graphPlotItem">
                  <Line
                    data={{
                      labels: selectGraph && selectGraph.labels,
                      datasets: [
                        {
                          label: selectTopic,
                          data: selectGraph && selectGraph.datasets,
                          backgroundColor: backgroundColor && backgroundColor,
                          borderColor: borderColor && borderColor,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{maintainAspectRatio: false,
                      scales: {y: {beginAtZero: true,},},
                    }}
                  />
                </div> */}
              </div>
            </div> }
          </div>
          <div className="reportcard">
            <div className="report-title dashboard-title">Reports</div>
            <div className="reportcontent d-a-flex">
              <div className="reportGraph">
                <div className="reportGraphItem">
                  <table id="showContent" className="table table-striped table-bordered"></table>
                </div>
              </div>
            </div>
          </div>
        
        </div>
        : user && user.role === "developer" | user.role === "manager" && activeDashboardItemLink === "assigned-issue" ? 
        <div className="dash-developer">
          <div className="dash-developer-content">
            {issueTracker && issueTracker.length>0 ? 
            <>
              <div className="dash-developer-content-item">
                {issueTracker && issueTracker.map((issue, index) => (
                  issue.issue_id !== null ? 
                    <button key={index} className="dashItemBtn" id={index} onClick={() => openIssueTracker(index, issue)}>{issue.issue_id.title.substring(0, 25)}</button>
                  : null
                ))}
              </div>
              <div className="dash-developer-content-item-issue">
                { issueTrackerDataById && issueTrackerDataById.issue_id ?
                  <UpdateAssignIssue singleIssue={issueTrackerDataById} />
                : "No issue selected"
                 }
              </div>
            </>
            : "No assigned issue"
            }
          </div>
        </div>
        : activeDashboardItemLink === "reviews" ?
        <div className="dash-reviews">
          <div className="dash-reviews-content d-flex">
            <div className="dash-reviews-content-item">
              <div className="dash-reviews-content-title">Review Details</div>
              <div className="dash-reviews-content-details">
                {issueTrackerReview && issueTrackerReview.length>0 ?
                <>
                  {issueTrackerReview && issueTrackerReview.map((review, index) => (
                    review?._id !== null ?
                    <div className="singleCommonEdit" key={index}>
                        <div className="commonEditHeader">
                            <div className="table-title dashboard-title">{review?.issuetracker_id.title}</div>
                        </div>
                        <div className="commonEditDetails">
                            <div className="commonEditActualContent">
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Title</div>
                                <div className="commonEditDetailsValue">{review?.issue_id.title}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Project</div>
                                <div className="commonEditDetailsValue">{review?.project_id?.title}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Created By</div>
                                <div className="commonEditDetailsValue">{review?.creator_id?.username}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Updated At</div>
                                <div className="commonEditDetailsValue">{review?.updatedAt}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Created At</div>
                                <div className="commonEditDetailsValue">{review?.createdAt}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Updated By</div>
                                <div className="commonEditDetailsValue">{review?.user_id?.username}</div>
                            </div>
                            </div>
                            <div className="commonEditActualContent">
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Description</div>
                                <div className="commonEditDetailsValue">{review?.issue_id.description}</div>
                            </div>
                            <div className="commonEditDetailsItem">
                                <div className="commonEditDetailsLabel">Status</div>
                                <div className="commonEditDetailsValue">{review?.status}</div>
                            </div>
                            </div>
                        </div>
                    </div>
                    : "No review assigned"
                    
                  ))

                }
                </>
                : <div className="feature-svg">
                      "No review assigned"
                      <img src="../../Assets/Picture/greetings2.svg" alt="bug fixing" />
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
        : null : <div className="greetings">
        <div className="greeting d-flex-column">
          <div className="dashboard-title"><h1>Welcome to Bug Tracker</h1></div>
          <div className="dashboard-content"><p>Please login to access the dashboard</p></div>
        </div>
        <div className="features">
          <div className="dashboard-title">Features</div>
          <div className="feature d-flex">
            <ul>
              <li>Admin can view all users, projects, issues and public issues</li>
              <li>Admin can view the graph of issues and projects</li>
              <li>Manager can view all projects and issues</li>
              <li>Manager create projects and issues</li>
              <li>Manager can assign projects and issues to developers</li>
              <li>Developer can view assigned issues and reviews</li>
              <li>Developer can update the assigned issues</li>
              <li>Users can view public issues</li>
              <li>Users can create public issues</li>
            </ul>
            <div className="feature-svg">
              <img src="../../Assets/Picture/greetings.svg" alt="bug fixing" />
            </div>
          </div>
        </div>
        </div>
      }
          
      </div>
    </div>
  );
};

export default Dashboard;
