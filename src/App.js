import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Issues from './components/Issues/Issues';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
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
          <Login />
        </>
        } />
        <Route path="/register" element={
        <>
          <Register />
        </>
        } />
        <Route path="/issues" element={
        <>
          <Issues />
        </>
        } />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
 </>   
  );
}

export default App;
