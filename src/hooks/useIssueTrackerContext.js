import { useContext } from 'react';
import { IssueTrackerContext } from '../context/IssueTrackerContext';

export const useIssueTrackerContext = () => {
    const context = useContext(IssueTrackerContext);

    if (!context) {
        throw new Error('useIssueTrackerContext must be used within an IssueTrackerContextProvider');
    }

    return context;
}