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
        img.style.transform = "scale(1.5)";
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
                        <p>Name: {user && captilizeFirstLetter(user.username)}</p>
                        <p>Email: {user && user.email}</p>
                        <p>Role: {user && captilizeFirstLetter(user.role)}</p>
                        
                    </div>
                    <div className="profile-activity">
                        <h3>Recent Activity</h3>
                        <ul>
                            <li>Last seen: {user && lastSeen}</li>
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