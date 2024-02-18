const { useEffect } = require("react");

const FetchProjects = (userDetails, setProjects) => {
    
    useEffect(() => {
        fetch("api/projects/user/65b6b6b8d9df8dd43ddade6b")
        .then((response) => response.json())
        .then((data) => {
            console.log(data, "from handleCreateIssue.jsx");
            if (data.status === true) {
                setProjects(data.data);
            } else {
                setProjects([]);
            }
        })
        .catch((error) => {
            console.log(error, "from handleCreateIssue.jsx");
            setProjects([]);
        });
    }, [userDetails]);
}

module.exports = { 
    FetchProjects
};