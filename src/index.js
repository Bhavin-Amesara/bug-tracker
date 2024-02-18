import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { IssueContextProvider } from './context/IssueContext';
import { AuthContextProvider } from './context/AuthUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <IssueContextProvider>
        <App />
      </IssueContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
