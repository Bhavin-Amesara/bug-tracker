import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Logout from './components/Logout/Logout';
import Issues from './components/Issues/Issues';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState , useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    fetch("api/auth/maintainLogin")
    .then((response) => response.json())
    .then((data) => {
        if(data.message === "Authorized"){
          setIsLoggedIn(true);
          setLoggedInUser(data.email);
          setUserDetails(data);
        } else {
          setIsLoggedIn(false);
        }
    });
  }, [isLoggedIn]);
  return (
 <>
    <Router>
        <Navbar IsLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={
          <>
            <Dashboard />
          </>
        } />
        <Route path="/login" element={
        <>
          <Login setIsLoggedIn={setIsLoggedIn} />
        </>
        } />
        <Route path="/register" element={
          <>
          <Register />
        </>
        } />
        <Route path="/logout" element={
        <>
          <Logout setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </>
        } />
        <Route path="/issues" element={
        <>
          <Issues userDetails={userDetails} />
        </>
        } />
        <Route path="/profile" element={
        <>
          <Profile userDetails={userDetails} />
        </>
        } />
        <Route path="*" element={
        <>
          <ErrorPage />
        </>
        } />
      </Routes>
    </Router>
 </>   
  );
}

export default App;
