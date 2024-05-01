import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../hooks/useAuthContext";

const LoginPage = () => {
    // context
    const { dispatch } = useAuthContext();

    const navigate = useNavigate();
    const mySwal = withReactContent(Swal);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginMsg, setLoginMsg] = useState("")
    const [setErrorClass, setSetErrorClass] = useState("error")
        
    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            setLoginMsg("Please enter email and password");
            setSetErrorClass("authFailed");
            return;
        }
        const user = {
            email: email,
            password: password,
        };

        fetch("http://localhost:3300/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data,"login page");
            if (data.status === true) {
                localStorage.setItem("user", JSON.stringify({
                    userId: data.data.userId,
                    isLoggedIn: data.data.isLoggedIn,
                    username: data.data.username,
                    email: data.data.email,
                    role: data.data.role,
                    lastSeen: data.data.lastSeen,
                    token: data.extraDetails.token,
                }));
                dispatch({ type: "LOGIN", payload: data.data });
                mySwal.fire({
                    title: "Login successful",
                    text: "You have been logged in successfully",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => {
                    if(data.data.role === "user"){
                        navigate("/bugzones");
                    } else {
                        navigate("/");
                    }
                });
                setLoginMsg(data.message);
                setSetErrorClass("authSuccess");
            } else if (data.status === false) {
                setLoginMsg(data.message);
                setSetErrorClass("authFailed");
                mySwal.fire({
                    title: "Error",
                    html: `<div class="error-msg">${data.message}</div>` + `<div class="error-msg">${data.extraDetails}</div>`,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            } else {
                mySwal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                setLoginMsg(data.message);
                setSetErrorClass("authFailed");
            }
        });
    }

    return <div className="authContainer container">
        <div className="titleContainer">
            <h2>Login</h2>
        </div>
        <div className="form">
            <form onSubmit={handleLogin} className="formAuth d-flex-column">
                <div className="inputContainer">
                <span className="material-symbols-outlined">email</span>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email here"
                        onChange={ev => setEmail(ev.target.value)}
                        className="inputBox" />
                </div>
                
                <div className="inputContainer">
                    <span className="material-symbols-outlined">password</span>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password here"
                        onChange={ev => setPassword(ev.target.value)}
                        className="inputBox" />
                </div>
                
                <div className="inputContainer">
                    <input
                        className="inputButton"
                        type="submit"
                        value={"Log in"} />
                </div>
            </form>
            <div className={setErrorClass}>
                <span>{loginMsg}</span>
            </div>
            <div className="authLink">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
            <div className="authLink">
                Forgot password? <Link to="/forgot-password">Reset</Link>
            </div>
        </div>
    </div>
}

export default LoginPage;