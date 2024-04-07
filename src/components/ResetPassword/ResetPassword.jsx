import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
    // context
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetMsg, setResetMsg] = useState("");
    const [setErrorClass, setSetErrorClass] = useState("error");

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (email === "" || password === "" || confirmPassword === "") {
            setResetMsg("Please enter email and password");
            setSetErrorClass("error");
            return;
        }
        if (password !== confirmPassword) {
            setResetMsg("Passwords do not match");
            setSetErrorClass("error");
            return;
        }
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        fetch("http://localhost:3300/api/auth/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status === true) {
                dispatch({ type: "LOGIN", payload: data.data });
                setResetMsg(data.message);
                navigate("/login");
            } else {
                setResetMsg(data.message);
            }
        });
    }

    return (
        <div className="authContainer container">
           <div className="titleContainer">
                <h2>Reset Password</h2>
            </div>
            <div className="form">
                <form className="formAuth d-flex-column" onSubmit={handleResetPassword}>
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">email</span>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email here"
                            onChange={(e) => setEmail(e.target.value)}
                            className="inputBox" />
                    </div>
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">lock</span>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password here"
                            onChange={(e) => setPassword(e.target.value)}
                            className="inputBox" />
                    </div>
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">lock</span>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm your password here"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="inputBox" />
                    </div>
                    <div className="inputContainer">
                        <input
                            className="inputButton"
                            type="submit"
                            value={"Reset Password"} />
                    </div>
                </form>
                <div className={setErrorClass}>{resetMsg}</div>
                <div className="authLink">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
                <div className="authLink">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
