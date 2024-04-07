import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import "./BugZone.scss";

const ViewBug = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3300/api/public-issues')
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setBugs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openBug = (id) => {
    navigate(`/bugzone/${id}`);
  }

  return (
    <>
        <div className="viewBug">
          {bugs.map((bug) => (
            <div key={bug._id} className="public-bugs">
              <div className="bug-header-row">
                <div className="bug-title">
                  <h3>{bug.title}</h3>
                </div>
                <div className="bug-creator">
                  <span>{bug.created_by.username}</span>
                </div>
              </div>
              <div className="bug-description">
                <p>{bug.description}</p>
              </div>
              <div className='bug-footer'>
                <button className="btn-button" onClick={() => {openBug(bug._id)}}>View</button>
                <div className="bug-tags">
                  <div className="bug-feature">
                    <span>{bug.feature}</span>
                    <span>{bug.status}</span>
                  </div>
                  <div className='bug-votes'>
                    <span>Up: {bug.upvotes}</span>
                    <span>Down: {bug.downvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> 
    </>
  );
};
export default ViewBug;
