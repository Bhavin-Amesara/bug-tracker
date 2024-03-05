import { useAuthContext } from "../../hooks/useAuthContext";
const { useEffect } = require("react");

const FetchProjects = (userDetails, setProjects) => {
    // context
    const { user } = useAuthContext();
    const userId = user && user.isLoggedIn ? user.userId : "";
    console.log(userId, "from handleCreateIssue.jsx");

    useEffect(() => {
        fetch("api/projects/user/" + userId, )
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

export { FetchProjects };