import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useState, useEffect } from 'react';

const ReportBug = () => {
  const { user } = useAuthContext();
  const userName = user.username;
  const created_by = user.userId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("feature", feature);
    data.append("created_by", created_by);
    data.append("file", file);
    
    fetch('http://localhost:3300/api/public-issues/65ffcff67125e1790201160f', {
      method: 'PUT',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
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
              method="POST"
              className="formFields d-flex-column"
              encType="multipart/form-data"
            >
              <div className="formFields">
                {/* check css for form-group class in app.scss file */}
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" name="username" id="username" value={userName} readOnly/>
                </div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Enter project description"
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
                  <label htmlFor="file">Attach File</label>
                  <input type="file" name="file" id="file" multiple />
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
