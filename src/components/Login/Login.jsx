import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LoginPage = ({setIsLoggedIn}) => {

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

        fetch("api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message === "Login successful") {
                setIsLoggedIn(true);
                mySwal.fire({
                    title: "Login successfully",
                    text: "You are now logged in",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => {
                    navigate("/issues");
                });
                setLoginMsg(data.message);
                setSetErrorClass("authSuccess");
            } else if (data.message === "Unauthorized") {
                setLoginMsg(data.message);
                setSetErrorClass("authFailed");
            } else {
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
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email here"
                        onChange={ev => setEmail(ev.target.value)}
                        className="inputBox" />
                </div>
                
                <div className="inputContainer">
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
        </div>
    </div>
}

export default LoginPage;