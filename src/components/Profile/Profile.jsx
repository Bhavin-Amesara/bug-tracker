import './Profile.scss';

const Profile = () => {
    return (
        <>
            <div className="profile-container">
                <div className="profile-title">
                    <h2>User Profile</h2>
                </div>
                <div className="profile-dashboard">
                    {/* Add your profile dashboard components and content here */}
                    <div className="profile-info">
                        <h3>Personal Information</h3>
                        <p>Name: John Doe</p>
                        <p>Email: john.doe@example.com</p>
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