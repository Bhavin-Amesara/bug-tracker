import { useAuthContext } from "./useAuthContext";
const useLogout = () => {
    const { user, dispatch } = useAuthContext();
    const logout = () => {
        console.log("Logging out", user);
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT", payload: null });
    };

    return logout;
};

export default useLogout;
