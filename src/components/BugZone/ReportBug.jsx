const ReportBug = () => {
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
                  <input type="text" name="username" id="username" />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Enter project description"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="feature">Features</label>
                  <select name="feature" id="feature" required>
                    <option value="minor">Bug</option>
                    <option value="major">Error</option>
                    <option value="critical">New</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="file">Attach File</label>
                  <input type="file" name="file" id="file" multiple />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn-button">
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
