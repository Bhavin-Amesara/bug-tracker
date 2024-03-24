import React, { useState } from 'react';
import ReportBug from './ReportBug';
import UpdateBug from './UpdateBug';
import ViewBug from './ViewBug';

// Parent component
const Bugzone = ({ activeBugzoneLink }) => {

  return (
    <div>
      <div className='container'>
        <div className='bugzoneHeader'>
          <div className='dashboard-title'>Bugzone</div>
        </div>
        <div className='bugzone-content'>
          {
            activeBugzoneLink === 'reportBugzone' ? <ReportBug /> :
            activeBugzoneLink === 'updateBugzone' ? <UpdateBug /> : 
            activeBugzoneLink === 'viewBugzone' ? <ViewBug /> : null
          }
        </div>
      </div>
    </div>
  );
}

export default Bugzone;
