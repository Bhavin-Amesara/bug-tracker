import React, { useState, useEffect } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { useAuthContext } from '../../hooks/useAuthContext';

const Notification = (props) => {
    // context
    const { user } = useAuthContext();
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        if (popoverOpen) {
            setTimeout(() => {
                setPopoverOpen(false);
                
            }, 10000);
        }
        try {
            if (user.isLoggedIn) {
                const notification = setTimeout(() => {
                    fetch('http://localhost:3300/api/notifications/user/' + user.userId)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === true){
                            // filter out if issue is undefined
                            data.data = data.data.filter(notification => notification.issue !== null);
                            // sort by unread notifications
                            console.log(data.data, 'notifications');
                            data.data.sort((a, b) => (a.notification_status === 'unread' ? -1 : 1));
                            setUnreadNotifications(data.data.filter(notification => notification.notification_status === 'unread').length);
                            setNotifications(data.data);
                        }
                    });
                }, 60000);
                return () => clearInterval(notification);
            }
        } catch (error) {
            console.log(error);
        }
    }, [popoverOpen, user.isLoggedIn, user.userId]);

    const toggle = () => {
        setPopoverOpen(!popoverOpen);
        try {
            setTimeout(() => {
                fetch('http://localhost:3300/api/notifications/user/' + user.userId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === true){
                        setUnreadNotifications(0);
                        setNotifications(notifications.map(notification => {
                            notification.notification_status = 'read';
                            return notification;
                        }));
                    }
                });
                setUnreadNotifications(0);
            }, 10000);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>
            <Button id="Popover1" type="button" className={unreadNotifications > 0 ? 'Popover1 unread-notification-color' : 'Popover1 read-notification-color'} onClick={toggle} style={{padding: '7px'}} >
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" x="128" y="128" role="img" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path fill="currentColor" d="M6.429 2.413a.75.75 0 0 0-1.13-.986l-1.292 1.48a4.75 4.75 0 0 0-1.17 3.024L2.78 8.65a.75.75 0 1 0 1.5.031l.056-2.718a3.25 3.25 0 0 1 .801-2.069l1.292-1.48Z"/><path fill="currentColor" fillRule="evenodd" d="M6.237 7.7a4.214 4.214 0 0 1 4.206-3.95H11V3a1 1 0 1 1 2 0v.75h.557a4.214 4.214 0 0 1 4.206 3.95l.221 3.534a7.376 7.376 0 0 0 1.308 3.754a1.617 1.617 0 0 1-1.135 2.529l-3.407.408V19a2.75 2.75 0 1 1-5.5 0v-1.075l-3.407-.409a1.617 1.617 0 0 1-1.135-2.528a7.377 7.377 0 0 0 1.308-3.754l.221-3.533Zm4.206-2.45a2.714 2.714 0 0 0-2.709 2.544l-.22 3.534a8.877 8.877 0 0 1-1.574 4.516a.117.117 0 0 0 .082.183l3.737.449c1.489.178 2.993.178 4.482 0l3.737-.449a.117.117 0 0 0 .082-.183a8.876 8.876 0 0 1-1.573-4.516l-.221-3.534a2.714 2.714 0 0 0-2.709-2.544h-3.114Zm1.557 15c-.69 0-1.25-.56-1.25-1.25v-.75h2.5V19c0 .69-.56 1.25-1.25 1.25Z" clipRule="evenodd"/><path fill="currentColor" d="M17.643 1.355a.75.75 0 0 0-.072 1.058l1.292 1.48a3.25 3.25 0 0 1 .8 2.07l.057 2.717a.75.75 0 0 0 1.5-.031l-.057-2.718a4.75 4.75 0 0 0-1.17-3.024l-1.292-1.48a.75.75 0 0 0-1.058-.072Z"/></g></svg>
                <span className={unreadNotifications > 0 ? 'notification-count unread-color' : 'notification-count'}>{unreadNotifications > 0 ? unreadNotifications : ''}</span>
            </Button>
            <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>Notifications</PopoverHeader>
                <PopoverBody>
                    {notifications && notifications.length > 0 ? notifications.map((notification, index) => (
                        notification.notification_status === 'unread' ?
                        <div key={index} className='unread'>
                            <p>{notification.notification_title}</p>
                            <hr />
                        </div>
                        :
                        <div key={index}>
                            <p>{notification.notification_title}</p>
                            <hr />
                        </div>
                    )) : <h5>No Notifications</h5>}
                </PopoverBody>
            </Popover>
        </div>
    );
}

export default Notification;