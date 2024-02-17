const { useEffect } = require("react");

const FetchProjects = (userDetails, setProjects) => {
    
    useEffect(() => {
        fetch("api/projects/user/" + userDetails.userId,)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === true) {
                setProjects(data.projects);
            } else {
                console.log(data.message, "from handleCreateIssue.jsx");
                setProjects([]);
            }
        })
        .catch((error) => {
            console.log(error, "from handleCreateIssue.jsx");
        });
    }, [userDetails]);
}

module.exports = { 
    FetchProjects
};