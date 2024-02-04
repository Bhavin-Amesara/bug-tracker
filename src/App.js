import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
 <>
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Dashboard />
          </>
        } />
      </Routes>
    </Router>
 </>   
  );
}

export default App;
