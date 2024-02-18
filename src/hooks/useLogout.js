import { useAuthContext } from "./useAuthContext";
const useLogout = () => {
    const { user, dispatch } = useAuthContext();
    const logout = () => {
        console.log("Logging out", user);
        // update last seen
        fetch("api/users/lastseen/" + user.userId, {
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

        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT", payload: null });
    };

    return logout;
};

export default useLogout;
