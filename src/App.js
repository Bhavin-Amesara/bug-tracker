import './App.scss';
import { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
// import Logout from './components/Logout/Logout';
import Issues from './components/Issues/Issues';
import { SingleIssueView } from './components/Issues/SingleIssueView';
import ErrorPage from './components/AuthPage/ErrorPage';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { IssueTrackerContextProvider } from './context/IssueTrackerContext';
import Project from './components/Project/Project';
import { ProjectContextProvider } from './context/ProjectContext';
import SingleProjectView from './components/Project/SingleProjectView';
import Sidebar from './components/Sidebar/Sidebar';
import Bugzone from './components/BugZone/BugZone';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SingleBugzoneView from './components/BugZone/SingleBugzoneView';
import AccessDeniedPage from './components/AuthPage/AccessDeniedPage';

function App() {
  const { user } = useAuthContext();
  const [activeIssueLink, setActiveIssueLink] = useState("viewIssues");
  const [activeProjectLink, setActiveProjectLink] = useState("viewProjects");
  const [activeSingleIssueLink, setActiveSingleIssueLink] = useState("singleIssueDetails");
  const [activeSingleProjectLink, setActiveSingleProjectLink] = useState("singleProjectDetails");
  const [activeBugzoneLink, setActiveBugzoneLink] = useState("viewBugzone");
  const [activeSingleBugzoneLink, setActiveSingleBugzoneLink] = useState("viewSingleBugzone");
  const [dashboardData, setDashboardData] = useState([]);
  const [activeDashboardItemLink, setActiveDashboardItemLink] = useState("");
  const [activeSingleIssueReopenLink, setActiveSingleIssueReopenLink] = useState(false);
  
  return (
 <>
    <Router>
      <Navbar 
        setActiveBugzoneLink={setActiveBugzoneLink}
        setActiveIssueLink={setActiveIssueLink}
        setActiveProjectLink={setActiveProjectLink}
      />
      <div className="main-container">
      { user && user.isLoggedIn ? 
        <div className="sidebar-container">
          <Sidebar 
            userName={user && user.username} 
            setActiveIssueLink={setActiveIssueLink}
            setActiveProjectLink={setActiveProjectLink}
            setActiveSingleIssueLink={setActiveSingleIssueLink}
            setActiveSingleProjectLink={setActiveSingleProjectLink}
            setActiveBugzoneLink={setActiveBugzoneLink}
            setActiveSingleBugzoneLink={setActiveSingleBugzoneLink}
            setActiveDashboardItemLink={setActiveDashboardItemLink}
            dashboardData={dashboardData}
            activeSingleIssueReopenLink={activeSingleIssueReopenLink}
            setActiveSingleIssueReopenLink={setActiveSingleIssueReopenLink}
          />
        </div>
        : null }
        <div className={user && user.isLoggedIn ? "content-container" : "content-container-full"}>

      <Routes>
        <Route path="/" element={
          <>
            <Dashboard setDashboardData={setDashboardData} activeDashboardItemLink={activeDashboardItemLink} />
          </>
        } />
        <Route path="/login" element={
        <>
          {user && user.isLoggedIn ? <Dashboard /> : <Login />}
        </>
        } />
        <Route path="/register" element={
        <>
          {user && user.isLoggedIn ? <Dashboard /> : <Register />}
        </>
        } />
        <Route path="/forgot-password" element={
        <>
          {user && user.isLoggedIn ? <Dashboard /> : <ResetPassword />}
        </>
        } />
        <Route path="/bugzones" element={
        <>
          {user && user.isLoggedIn ? <Bugzone activeBugzoneLink={activeBugzoneLink} /> : <Login />}
        </>
        } />
        <Route path="/bugzone/:id" element={
        <>
          {user && user.isLoggedIn ? <SingleBugzoneView activeSingleBugzoneLink={activeSingleBugzoneLink} /> : <Login />}
        </>
        } />
        <Route path="/issues" element={
        <>
          {user && user.isLoggedIn ? 
            user.role === "user" ? <AccessDeniedPage /> :
            <Issues activeIssueLink={activeIssueLink} /> 
          : <Login />}
        </>
        } />
        <Route path="/issue/:id" element={
        <>
          {user && user.isLoggedIn ? 
            user.role === "user" ? <AccessDeniedPage /> :
          <IssueTrackerContextProvider>
            <SingleIssueView 
              activeSingleIssueLink={activeSingleIssueLink} 
              setActiveSingleIssueReopenLink={setActiveSingleIssueReopenLink} 
              activeSingleIssueReopenLink={activeSingleIssueReopenLink}
              setActiveSingleIssueLink={setActiveSingleIssueLink}
            />
          </IssueTrackerContextProvider>
          : <Login />}
        </>
        } />
        <Route path="/profile" element={
        <>
          {user && user.isLoggedIn ? <Profile /> : <Login />}
        </>
        } />
        <Route path="/projects" element={
        <>
          {user && user.isLoggedIn ? 
            user.role === "user" ? <AccessDeniedPage /> : 
          <ProjectContextProvider>
            <Project activeProjectLink={activeProjectLink} />
          </ProjectContextProvider>
          : <Login />}
        </>
        } />
        <Route path="/project/:id" element={
        <>
          {user && user.isLoggedIn ? 
            user.role === "user" ? <AccessDeniedPage /> :
          <ProjectContextProvider>
            <SingleProjectView activeSingleProjectLink={activeSingleProjectLink} />
          </ProjectContextProvider>
          : <Login />}
        </>
        } />
        <Route path="*" element={
        <>
          <ErrorPage />
        </>
        } />
      </Routes>
      </div>
      </div>
    </Router>
 </>   
  );
}

export default App;
