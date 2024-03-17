import './App.scss';
import { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
// import Logout from './components/Logout/Logout';
import Issues from './components/Issues/Issues';
import { SingleIssueView } from './components/Issues/SingleIssueView';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { IssueTrackerContextProvider } from './context/IssueTrackerContext';
import Project from './components/Project/Project';
import { ProjectContextProvider } from './context/ProjectContext';
import SingleProjectView from './components/Project/SingleProjectView';
import Sidebar from './components/Sidebar/Sidebar';
import Bugzone from './components/BugZone/BugZone';

function App() {
  const { user } = useAuthContext();
  const [activeIssueLink, setActiveIssueLink] = useState("viewIssues");
  const [activeProjectLink, setActiveProjectLink] = useState("viewProjects");
  const [activeSingleIssueLink, setActiveSingleIssueLink] = useState("singleIssueDetails");
  const [activeSingleProjectLink, setActiveSingleProjectLink] = useState("singleProjectDetails");
  const [activeBugzoneLink, setActiveBugzoneLink] = useState("viewBugzone");
  
  return (
 <>
    <Router>
      <Navbar />
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
          />
        </div>
        : null }
        <div className={user && user.isLoggedIn ? "content-container" : "content-container-full"}>

      <Routes>
        <Route path="/" element={
          <>
            <Dashboard />
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
        <Route path="/bugzone" element={
        <>
          {user && user.isLoggedIn ? <Bugzone activeBugzoneLink={activeBugzoneLink} /> : <Login />}
        </>
        } />
        <Route path="/issues" element={
        <>
          {user && user.isLoggedIn ? <Issues activeIssueLink={activeIssueLink} /> : <Login />}
        </>
        } />
        <Route path="/issue/:id" element={
        <>
          {user && user.isLoggedIn ? 
          <IssueTrackerContextProvider>
            <SingleIssueView activeSingleIssueLink={activeSingleIssueLink} />
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
          <ProjectContextProvider>
            <Project activeProjectLink={activeProjectLink} />
          </ProjectContextProvider>
          : <Login />}
        </>
        } />
        <Route path="/project/:id" element={
        <>
          {user && user.isLoggedIn ? 
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
