import './Profile.scss';
import { useState, useEffect } from 'react';

const Profile = ({ userDetails }) => {
    console.log(userDetails);
    function zoomImage() {
        var img = document.querySelector('.profile-picture img');
        img.style.transform = "scale(1.5)";
        img.style.transition = "transform 0.25s ease";

        // blur the background
        // var container = document.querySelector('.profile-container');
        // container.style.filter = "blur(2px)";
        // container.style.transition = "filter 0.25s ease";
        // setTimeout(() => {
        //     container.style.filter = "blur(0px)";
        // }, 2000);
    }


    function handleProfilePicture() {
        document.getElementById('fileInput').click();
    }

    return (
        <>
            <div className="profile-container container">
                <div className="profile-title">
                    <h2>User Profile</h2>
                </div>
                <div className="profile-picture">
                    <form method="post" encType="multipart/form-data" className='profile-picture-form' >
                        <img src="https://via.placeholder.com/150" onMouseOver={zoomImage} onMouseOut={() => { document.querySelector('.profile-picture img').style.transform = "scale(1)"; }} alt="Profile Picture" />
                        <input type="file" id="fileInput" style={{display: "none"}} />        
                        <button type="button" onClick={handleProfilePicture}>Change Picture</button>
                    </form>
                </div>
                <div className="profile-dashboard">
                    {/* Add profile picture */}
                    <div className="profile-info">
                        <h3>Personal Information</h3>
                        <p>Name: {userDetails.username}</p>
                        <p>Email: {userDetails.email}</p>
                        {/* Add more profile information */}
                    </div>
                    <div className="profile-activity">
                        <h3>Recent Activity</h3>
                        <ul>
                            <li>Logged in on 2022-01-01</li>
                            <li>Updated profile picture on 2022-01-02</li>
                            {/* Add more recent activity */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;