import React, { useState, useEffect } from 'react'; 
import { Button } from 'react-bootstrap';
import "./BugZone.scss";

const ViewBug = () => {
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

  return (
    <>
        <div className="viewBug">
          {bugs.map((bug) => (
            <div key={bug.id} className="public-bugs">
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
              <div className="bug-feature">
                <span>{bug.feature}</span>
              </div>
            </div>
          ))}
        </div> 
    </>
  );
};
export default ViewBug;
