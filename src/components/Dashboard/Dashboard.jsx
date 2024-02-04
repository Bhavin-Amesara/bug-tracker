// import React from 'react';
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard container">
      <div className="dashheader">
        <div className="dashname">Dashboard</div>
        <div className="dashsearch">
          <input type="text" className="c-dash-comp1" placeholder="Search" />
          <button className="c-dash-comp1">Search</button>
        </div>
      </div>

      <div className="dashcontent">
        <div className="countcards">
          <div className="dashboard-title">
            <div className="cardtitle">Bugs/Issues</div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardtitle">Bugs</div>
              <div className="cardname">Total</div>
              <div className="cardcount">1K</div>
            </div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardtitle">Issues</div>
              <div className="cardname">Open</div>
              <div className="cardcount">98</div>
            </div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardtitle">Issues</div>
              <div className="cardname">Closed</div>
              <div className="cardcount">908</div>
            </div>
          </div>
        </div>

        <div className="dashreport">
          <div className="reportcard dashboard-title">
            <div className="reporttitle">Reports</div>
            <div className="reportcontent">
              <div className="reportGraphButton">
                <span>Project</span>
                <span>Issues</span>
                <span>Resolved</span>
              </div>
              <div className="reportGraph">
                <div className="reportGraphItem">
                  <img src="https://via.placeholder.com/150" alt="graph" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
