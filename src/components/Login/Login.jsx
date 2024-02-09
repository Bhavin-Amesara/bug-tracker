import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./Login.scss";

const LoginPage = (props) => {

    const mySwal = withReactContent(Swal);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginMsg, setLoginMsg] = useState("")
    
        
    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            setLoginMsg("Please enter email and password");
            return;
        }
        fetch("auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message === "User found") {
                setLoginMsg("User found");
                mySwal.fire({
                    title: "User found",
                    text: "You are now logged in",
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            } else {
                setLoginMsg("User not found");
                mySwal.fire({
                    title: "Error",
                    text: "User not found",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
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
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={ev => setEmail(ev.target.value)}
                        className="inputBox" />
                </div>
                
                <div className="inputContainer">
                    <input
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
            <div className="errorLabel">
                <span>{loginMsg}</span>
            </div>
            <div className="authLink">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
    </div>
}

export default LoginPage;