import './Profile.scss';
import { useAuthContext } from '../../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Profile = () => {
    // context
    const { user } = useAuthContext();
    function captilizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var lastSeen = user.lastSeen;
    if (lastSeen) {
        lastSeen = formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
    }

    function zoomImage() {
        var img = document.querySelector('.profile-picture img');
        img.style.transform = "scale(1.2)";
        img.style.transition = "transform 0.25s ease";
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
                    {/* <form method="post" encType="multipart/form-data" className='profile-picture-form' > */}
                        {/* <img src="https://via.placeholder.com/150" onMouseOver={zoomImage} onMouseOut={() => { document.querySelector('.profile-picture img').style.transform = "scale(1)"; }} alt="Profile Picture" /> */}
                        <img src="data:image/jpeg;base64,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" onMouseOver={zoomImage} onMouseOut={() => { document.querySelector('.profile-picture img').style.transform = "scale(1)"; }} alt="Profile Picture" />
                        <input type="file" id="fileInput" style={{display: "none"}} />        
                        {/* <button type="button" onClick={handleProfilePicture}>Change Picture</button> */}
                    {/* </form> */}
                </div>
                <div className="profile-dashboard">
                    {/* Add profile picture */}
                    <div className="profile-info">
                        <h3>Personal Information</h3>
                        <p>Name: {user && captilizeFirstLetter(user.username)}</p>
                        <p>Email: {user && user.email}</p>
                        <p>Role: {user && captilizeFirstLetter(user.role)}</p>
                        
                    </div>
                    <div className="profile-activity">
                        <h3>Recent Activity</h3>
                        <ul>
                            <li>Last Logged In: {user && lastSeen}</li>
                            {/* <li>Updated profile picture on 2022-01-02</li> */}
                            {/* Add more recent activity */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;