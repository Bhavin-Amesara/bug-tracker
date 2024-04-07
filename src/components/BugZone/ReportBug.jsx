import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const Swal = require("sweetalert2");
const withReactContent = require("sweetalert2-react-content");
const mySwal = withReactContent(Swal);

const ReportBug = () => {
  // context
  const { user } = useAuthContext();
  const userName = user.username;
  const created_by = user.userId;
  const navigate = useNavigate();

  const [title, setTitle] = useState("Public Issue1");
  const [description, setDescription] = useState("Sample Desc");
  const [status, setStatus] = useState("minor");
  const [feature, setFeature] = useState("bug");
  const [file, setFile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("feature", feature);
    data.append("created_by", created_by);
    data.append("file", file);
    console.log(data);
    fetch("http://localhost:3300/api/issues/public-issues", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(data))
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          Swal.fire({
            title: 'Issue created successfully',
            icon: 'success',
            confirmButtonText: "Ok"
          }).then(() => {
            navigate("/bugzones");
          })
        } 
        toast.error(data.message);
      });
  }


  return (
    <>
      <div className="issueForm">
        <div className="formBody">
          <div className="formHeader">
            <div className="formTitle dashboard-title">Report Bug</div>
          </div>
          <div className="formContent">
            <form
              className="formFields d-flex-column"
              encType="multipart/form-data"
            >
              <div className="formFields">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" name="username" id="username" value={user && user.email} readOnly/>
                </div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Enter issue title"/>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Enter issue description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="feature">Features</label>
                  <select name="feature" id="feature" required onChange={(e) => setFeature(e.target.value)}>
                    <option value="bug">Bug</option>
                    <option value="defect">Defect</option>
                    <option value="enhancement">Enhancement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select name="status" id="status" required onChange={(e) => setStatus(e.target.value)}>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="blocker">Blocker</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="file">Attach File</label>
                  <input type="file" name="file" id="file" multiple onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn-button" onClick={handleSubmit}>
                    Report Bug
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReportBug;
