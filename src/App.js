import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
// import Logout from './components/Logout/Logout';
import Issues from './components/Issues/Issues';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  
  return (
 <>
    <Router>
      <Navbar />
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
        {/* <Route path="/logout" element={
        <>
          <Logout />
        </>
        } /> */}
        <Route path="/issues" element={
        <>
          {user && user.isLoggedIn ? <Issues /> : <Login />}
        </>
        } />
        <Route path="/profile" element={
        <>
          {user && user.isLoggedIn ? <Profile /> : <Login />}
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
