import React from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.scss';

const ErrorPage = () => {
  return (
    <div className="errorPage">
        <h1>404 - Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <p>Go back to the <Link to="/">homepage</Link></p>
    </div>
  );
};

export default ErrorPage;
