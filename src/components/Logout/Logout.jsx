import React from "react";
import { useState } from "react";
import "./Logout.scss";

const Logout = ({setIsLoggedIn}) => {
    const [data, setData] = useState("");
    
    setIsLoggedIn(false);
    fetch("api/auth/logout")
    .then((response) => response.json())
    .then((data) => {
        setData(data.message);
        console.log(data);
    });
    return (
        <div className="logoutPage">
            <h1>{data}</h1>
            <p>Please sign in again to continue</p>
        </div>
    );
}

export default Logout;