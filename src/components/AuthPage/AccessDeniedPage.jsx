import React, { useState } from "react";

const AccessDeniedPage = () => {
    return (
        <div className="errorPage">
            <h1>403 - Access Denied</h1>
            <p>Sorry, you are not authorized to view this page.</p>
        </div>
    );
}

export default AccessDeniedPage;
