
import "./Navbar.scss";
import NavMenuItem from "./NavMenuItem";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import useLogout from '../../hooks/useLogout';
import Notification from "./Notification";

const Navbar = ({ activeLink }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  
  const logout = useLogout();
  const handleLogout = async() => {
    await fetch("http://localhost:3300/api/users/lastseen/" + user.userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            lastseen: new Date(),
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
    await logout();
    navigate("/login");
  }

  // handle click event for the theme toggle
  const handleThemeClick = (props) => {
    if(props === 'sunlight'){
        document.documentElement.classList.remove('dark-theme');
        document.querySelector('.themeToggleBtnItem.active').classList.remove('active');
        document.querySelector('.themeToggleBtnItem').classList.add('active');
    } else if(props === 'moonlight'){
        document.documentElement.classList.add('dark-theme');
        document.querySelector('.themeToggleBtnItem.active').classList.remove('active');
        document.querySelector('.themeToggleBtnItem:last-child').classList.add('active');
    }
  }

  // handle click event for the notifications
  const handleNotifications = () => {
    console.log("Notifications clicked");
  }
  return (
    <nav>
      <div className="navbar container">
        <div className="navbar-left">
          <div className="nav-logo">
            {/* fetch bug icon */}
            🐞<NavLink to="/">BugTracker</NavLink>
          </div>
        </div>
        <div className="navbar-middle">
          <ul>
            <NavMenuItem title="BugZone" routeLink="/bugzones" activeLink={activeLink} />
            { user && user.role === "user" ? null :
            <>
              <NavMenuItem title="Projects" routeLink="/projects" activeLink={activeLink} />
              <NavMenuItem title="Tickets" routeLink="/issues" activeLink={activeLink} />
            </>
            }
            {/* <NavMenuItem title="Search" routeLink="/search" activeLink={activeLink} /> */}
          </ul>
        </div>
        {/* color theme toggle */}
        { user && user.isLoggedIn ? null :
        <div className="themeToggle">
            <div className="themeToggleBtn">
                <button className="themeToggleBtnItem active" onClick={() => handleThemeClick("sunlight")}>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><path d="M12 3V2m0 20v-1m9-9h1M2 12h1m15.5-6.5L20 4M4 20l1.5-1.5M4 4l1.5 1.5m13 13L20 20"/><circle cx="12" cy="12" r="4"/></g></g></svg></svg>
                </button>
                <button className="themeToggleBtnItem" onClick={() => handleThemeClick("moonlight")}>            
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="256px" height="256px" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img"xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" fillRule="evenodd" d="M11.486 4.768a7.25 7.25 0 1 0 7.399 9.51a6.25 6.25 0 0 1-7.398-9.51ZM3.25 12a8.75 8.75 0 0 1 10.074-8.65a.75.75 0 0 1 .336 1.342a4.75 4.75 0 1 0 5.83 7.499a.75.75 0 0 1 1.22.654A8.751 8.751 0 0 1 3.25 12Z" clipRule="evenodd"/></g></svg></svg>
                </button>
            </div>
        </div>}
        <div className="navbar-right">
          <div className="auth">
            { user && user.isLoggedIn ? 
              <>
                {/* <button className="notifications" onClick={}>
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M6.429 2.413a.75.75 0 0 0-1.13-.986l-1.292 1.48a4.75 4.75 0 0 0-1.17 3.024L2.78 8.65a.75.75 0 1 0 1.5.031l.056-2.718a3.25 3.25 0 0 1 .801-2.069l1.292-1.48Z"/><path fill="currentColor" fillRule="evenodd" d="M6.237 7.7a4.214 4.214 0 0 1 4.206-3.95H11V3a1 1 0 1 1 2 0v.75h.557a4.214 4.214 0 0 1 4.206 3.95l.221 3.534a7.376 7.376 0 0 0 1.308 3.754a1.617 1.617 0 0 1-1.135 2.529l-3.407.408V19a2.75 2.75 0 1 1-5.5 0v-1.075l-3.407-.409a1.617 1.617 0 0 1-1.135-2.528a7.377 7.377 0 0 0 1.308-3.754l.221-3.533Zm4.206-2.45a2.714 2.714 0 0 0-2.709 2.544l-.22 3.534a8.877 8.877 0 0 1-1.574 4.516a.117.117 0 0 0 .082.183l3.737.449c1.489.178 2.993.178 4.482 0l3.737-.449a.117.117 0 0 0 .082-.183a8.876 8.876 0 0 1-1.573-4.516l-.221-3.534a2.714 2.714 0 0 0-2.709-2.544h-3.114Zm1.557 15c-.69 0-1.25-.56-1.25-1.25v-.75h2.5V19c0 .69-.56 1.25-1.25 1.25Z" clipRule="evenodd"/><path fill="currentColor" d="M17.643 1.355a.75.75 0 0 0-.072 1.058l1.292 1.48a3.25 3.25 0 0 1 .8 2.07l.057 2.717a.75.75 0 0 0 1.5-.031l-.057-2.718a4.75 4.75 0 0 0-1.17-3.024l-1.292-1.48a.75.75 0 0 0-1.058-.072Z"/></g></svg>
                </button> */}
                <Notification />
                <NavLink to="/profile" className="profile">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.00002 21.8174C4.6026 22 5.41649 22 6.8 22H17.2C18.5835 22 19.3974 22 20 21.8174M4.00002 21.8174C3.87082 21.7783 3.75133 21.7308 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H17.2C18.8802 2 19.7202 2 20.362 2.32698C20.9265 2.6146 21.3854 3.07354 21.673 3.63803C22 4.27976 22 5.11984 22 6.8V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C20.2487 21.7308 20.1292 21.7783 20 21.8174M4.00002 21.8174C4.00035 21.0081 4.00521 20.5799 4.07686 20.2196C4.39249 18.6329 5.63288 17.3925 7.21964 17.0769C7.60603 17 8.07069 17 9 17H15C15.9293 17 16.394 17 16.7804 17.0769C18.3671 17.3925 19.6075 18.6329 19.9231 20.2196C19.9948 20.5799 19.9996 21.0081 20 21.8174M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Profile
                </NavLink>
                <button className="logout" onClick={handleLogout}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                  Logout
                </button>
              </>
              :
              <>
                <NavLink to="/login" className="login">
                  <svg width="186px" height="186px" viewBox="0 0 1024 1024" fill="currentColor" x="163" y="163" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7c-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8c7-8.5 14.5-16.7 22.4-24.5c32.6-32.5 70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8c47.9 0 94.3 9.3 137.9 27.8c42.2 17.8 80.1 43.4 112.7 75.9c32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8c-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5c-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z"/></g></svg>
                  Login
                </NavLink>
                <NavLink to="/register" className="onboarding">
                  <svg width="186px" height="186px" viewBox="0 0 1024 1024" fill="currentColor" x="163" y="163" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1c-.4.2-.8.3-1.2.5c-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8c2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"/></g></svg>
                  Register
                </NavLink>
              </>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
