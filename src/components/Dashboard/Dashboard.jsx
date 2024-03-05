// import React from 'react';
import DashboardCard from "./DashBoardCard";
import "./Dashboard.scss";
import 'datatables.net-dt/css/jquery.dataTables.min.css';


const Dashboard = () => {
  
  


  // only one time fetch data
  // useEffect(() => {
  //   fetch("api/users")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setuserData(data);
  //     })
  // }, [random]);

//     "username": "username",
//     "password": "password",
//     "email": "email",
//     "role": "role",
//     "status": "status",

  // const issueData = [
  //   issuedata.issues
  // ]
  
  
  return (
    <div className="dashboard container">
      <div className="dashheader d-a-flex">
        <div className="dashname">Dashboard</div>
        <div className="dashsearch d-a-flex">
          <input type="text" className="c-dash-comp1" placeholder="Search" />
          <button className="c-dash-comp1">Search</button>
        </div>
      </div>

      <div className="dashcontent">
        <div className="countcards">
          <div className="dashboard-title">
            <div className="cardtitle">Bugs/Issues</div>
          </div>

          <DashboardCard title="Bugs" value="1K" name={"Total"} />
          <DashboardCard title="Issues" value="98" name={"Open"} />
          <DashboardCard title="Issues" value="908" name={"Closed"} />
        </div>

        <div className="dashreport">
          <div className="reportcard">
            <div className="report-title dashboard-title">Reports</div>
            <div className="reportcontent d-a-flex">
              <div className="reportGraphButton d-a-flex">
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
