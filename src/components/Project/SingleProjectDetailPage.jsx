import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProjectContext } from "../../hooks/useProjectContext";
import { formatDistanceToNow } from "date-fns";
import { Line } from 'react-chartjs-2';

import { Chart } from 'chart.js/auto';
const SingleProjectDetailPage = () => {
    // context
    const { user } = useAuthContext();
    const { singleProject:project, dispatch } = useProjectContext();

    const { id } = useParams();
    const navigate = useNavigate();
    const [projectIssues, setProjectIssues] = useState();
    const [usersCount, setUsersCount] = useState();
    const [graphLabels, setGraphLabels] = useState([]);
    const [graphData1, setGraphData1] = useState([]);
    const [graphData2, setGraphData2] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3300/api/projects/' + id + '/details')
        .then((res) => res.json())
        .then((data) => {
            console.log(data?.data);
            if (data?.status === false) {
                navigate('/projects');
            }
            data.data.project.createdAt = formatDistanceToNow(new Date(data?.data?.project.createdAt), { addSuffix: true });
            data.data.project.updatedAt = formatDistanceToNow(new Date(data?.data?.project.updatedAt), { addSuffix: true });
            dispatch({ type: "SET_SINGLE_PROJECT", payload: data?.data?.project });
            
            setProjectIssues(data?.data?.issueCount);
            setUsersCount(data?.data?.countUniqueUsers);

            var fetchedData1 = data?.data?.graphData1;
            var fetchedData2 = data?.data?.graphData2;
            var labels = [];
            var data1 = [];
            var data2 = [];
            for (var key in fetchedData1) {
                labels.push(key);
            }
            for (var key in fetchedData2) {
                labels.push(key);
            }
            labels.sort();
            labels = labels.filter((item, index) => labels.indexOf(item) === index);
            
            for (var i = 0; i < labels.length; i++) {
                if (fetchedData1[labels[i]]) {
                    data1.push(fetchedData1[labels[i]]);
                } else {
                    data1.push(0);
                }
                if (fetchedData2[labels[i]]) {
                    data2.push(fetchedData2[labels[i]]);
                } else {
                    data2.push(0);
                }
            }
            // set the labels and data
            setGraphLabels(labels);
            setGraphData1(data1);
            setGraphData2(data2);
        });
        console.log(usersCount);
        console.log(projectIssues);
    }, [id]);

    const data = {
        labels: graphLabels,
        datasets: [
          {
            label: 'No. of Issues assigned to someone',
            data: graphData1,
            fill: true, // solid background color
            backgroundColor: '#ff5e5e55',
            borderColor: '#ff5e5e88',
            color: 'white',
          },
            {
                label: 'No. of Issues created',
                data: graphData2,
                fill: true, // solid background color
                backgroundColor: '#5e5eff55',
                borderColor: '#5e5eff88',
                color: 'white',
            },
        ],
      };


    return (
        <><div className="table-title dashboard-title">Project Details</div> 
                <div className="singleProjectDetails">
                    <div className="singleProjectContent">
                        <h1>Project: <span>{project && project?.title}</span></h1>
                        <p>Description: <span>{project && project?.description}</span></p>
                        <p>Created by: <span>{project && project?.created_by?.username}</span></p>
                        <p>Lead: <span>{project && project?.lead?.username}</span></p>
                        <p>Status: <span>{project && project?.status}</span></p>
                        <p>Visibility: <span>{project && project?.visibility}</span></p>
                        <p>Department: <span>{project && project?.department}</span></p>
                        <p>Created at: <span>{project && project?.createdAt}</span></p>
                        <p>Updated at: <span>{project && project?.updatedAt}</span></p>
                    </div>
                    <div className="singleProjectAnalytics">
                        <h1>Analytics</h1>
                        <p className="p-spanalytics"><span>Number of issues: { projectIssues } </span><span> Number of user (working on): { usersCount }</span></p>
                        <div className="chart">
                            <Line data={data} />
                        </div>  
                    </div>
                </div></>
    );
};

export default SingleProjectDetailPage;