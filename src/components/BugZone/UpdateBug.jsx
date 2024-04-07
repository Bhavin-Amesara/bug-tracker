import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

const UpdateBug = () => {
  const { id } = useParams();

  const { user } = useAuthContext();
  const userName = user.username;
  const created_by = user.userId;

  const [bugzone, setBugzone] = useState({});
  const [title, setTitle] = useState(bugzone && bugzone.title);
  const [description, setDescription] = useState(bugzone && bugzone.description);
  const [feature, setFeature] = useState(bugzone && bugzone.feature);
  const [status, setStatus] = useState(bugzone && bugzone.status);
  const [file, setFile] = useState("");

  useEffect(() => {
    fetch('http://localhost:3300/api/issues/public-issues/'+id)
      .then((response) => response.json())
      .then((response) => {
          console.log(response);
          response.data.createdAt = formatDistanceToNow(new Date(response.data.createdAt), { addSuffix: true });
          response.data.updatedAt = formatDistanceToNow(new Date(response.data.updatedAt), { addSuffix: true });
          setBugzone(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("feature", feature);
    data.append("status", status);    
    data.append("created_by", created_by);
    data.append("file", file);

    console.log(data);
    fetch("http://localhost:3300/api/public-issues/"+id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(data))
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          alert("Bug reported successfully");
        } else {
          alert("Failed to report bug");
        }
    });
  }

  const handleDelete = (e) => {
    e.preventDefault();
    fetch("http://localhost:3300/api/issues/public-issues/"+id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          alert("Bug deleted successfully");
        } else {
          alert("Failed to delete bug");
        }
    });
  }
  

  return (
    <>
      <div className="SingleBugzoneForm">
        <div className="singleCommonEdit">
          <div className="commonEditHeader">
            <div className="table-title dashboard-title">Update Bug</div>
          </div>
          <div className="commonEditDetails">
            <form method="POST" encType="multipart/form-data" className="commonEditDetailsForm" >
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Username</div>
                <input className="commonEditControls" type="text" name="username" id="username" value={user.email} readOnly/>
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Title</div>
                <input className="commonEditControls d-flex" type="text" name="title" id="title" required value={bugzone.title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter bug title"/>
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Status</div>
                <select className="commonEditDetailsValue" name="status" id="status" onChange={(e) => setStatus(e.target.value)} value={bugzone.status}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Features</div>
                <select className="commonEditDetailsValue" name="feature" id="feature" onChange={(e) => setFeature(e.target.value)} value={bugzone.feature}>
                  <option value="bug">Bug</option>
                  <option value="defect">Defect</option>
                  <option value="enhancement">Enhancement</option>
                </select>
              </div>
              <div className="commonEditDetailsItem singleBugzoneTextarea">
                <div className="commonEditDetailsLabel">Description</div>
                <textarea
                  className="commonEditDetailsValue"
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  value={bugzone.description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Attach File</div>
                <input className="commonEditControls d-flex" type="file" name="file" id="file" multiple onChange={(e) => setFile(e.target.files)} />
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Created At</div>
                <div className="commonEditDetailsValue">{bugzone.createdAt}</div>
              </div>
              <div className="commonEditDetailsItem">
                <div className="commonEditDetailsLabel">Updated At</div>
                <div className="commonEditDetailsValue">{bugzone.updatedAt}</div>
              </div>
              <div className="commonEditDetailsItem">
                <button type="submit" className="btn-button save" onClick={handleUpdate}>
                  Update Bug
                </button>
                <button type="submit" className="btn-button delete" onClick={handleDelete}>
                  Delete Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateBug;
