import React, { useState } from 'react';
import ReportBug from './ReportBug';
import UpdateBug from './UpdateBug';


// Box component
function Box({ text, onClick }) {
  return (
    <div onClick={onClick} className='btn-button'>
      {text}
    </div>
  );
}

// Parent component
function Bugzone() {
  const [componentToRender, setComponentToRender] = useState(null);

  const handleClick = (text) => {
    // Handle click event for each box
    console.log(`Clicked on text: ${text}`);
    
    // Render different forms based on the text clicked
    switch (text) {
      case "Report":
        setComponentToRender(<ReportBug />);
        break;
      case "Update":
        setComponentToRender(<UpdateBug />);
        break;
      case "Check":
        setComponentToRender(<UpdateBug />);
        break;
      default:
        setComponentToRender(null);
    }
  };

  return (
    <div>
      <div className='container d-a-flex'>
        <Box text="Report New Bug" onClick={() => handleClick("Report")} />
        <Box text="Update Bug Issue" onClick={() => handleClick("Update")} />
        <div className='btn-button'>
            View Bugs
        </div>
      </div>
      {componentToRender}
    </div>
  );
}

export default Bugzone;
