// import React from 'react';
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashname">Dashboard</div>
      <div className="dashcontent">
        <div className="countcards">
          <div className="cards">
            <div className="cardtitle">Bugs/Issues</div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardname">Total</div>
              <div className="cardcount">1K</div>
            </div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardname">Open</div>
              <div className="cardcount">98</div>
            </div>
          </div>
          <div className="cards">
            <div className="carditem">
              <div className="cardname">Closed</div>
              <div className="cardcount">908</div>
            </div>
          </div>
        </div>

        <div className="dashreport">
          <div className="reportcard">
            <div className="reporttitle">Reports</div>
            <div className="reportcontent">
              {/* <ul className="repUl">
              <li className="repLi">
                <a>"Report 1"</a>
              </li>
              <li className="repLi">
                <a>"Report 2"</a>
              </li>
              <li className="repLi">
                <a>"Report 3"</a>
              </li>
              <li className="repLi">
                <a>"Report 4"</a>
              </li>
            </ul> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
