import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./Register.scss";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [registerMsg, setRegisterMsg] = useState("");
    const [setErrorClass, setSetErrorClass] = useState("error")
    const navigate = useNavigate();

    const mySwal = withReactContent(Swal);

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            email: email,
            username: username,
            password: password,
            role: role,
        };

        if (email === "" || username === "" || password === "" || role === "") {
            setRegisterMsg("Please fill all fields");
            setSetErrorClass("authFailed");
            return;
        }

        fetch("http://localhost:3300/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.status);
            if (data.status === false) {
                setRegisterMsg(data.status);
                setSetErrorClass("authFailed");
                mySwal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            } else {
                console.log("User created successfully");
                setRegisterMsg("User created successfully");
                setSetErrorClass("authSuccess");
                
                mySwal.fire({
                    title: "User created successfully",
                    text: "You can now login",
                    icon: "success",
                    confirmButtonText: "Ok",
                });
                navigate("/login");
            }

        })
        .catch((error) => {
            // setRegisterMsg("Error: " + error.errMessage);
            // setMsgColor("red");
            mySwal.fire({
                title: "Error",
                text: "Error: " + error.errMessage,
                icon: "error",
                confirmButtonText: "Ok",
                backdrop: true,
            });
        });
    };

    return (
        <div className="authContainer container">
            <div className="titleContainer">
                <h2>Register</h2>
            </div>
            <div className="form">
                <form onSubmit={handleRegister} className="formAuth d-flex-column">
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">email</span>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username here"
                            // required
                        />
                    </div>
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">person</span>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email here"
                            // required
                        />
                    </div>
                    <div className="inputContainer">
                        <span className="material-symbols-outlined">password</span>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password here"
                            // required
                        />
                    </div>
                    <div className="inputContainer">
                        {/* already select  */}
                            <select 
                                id="role" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">Select a role</option>
                                <option value="developer">Developer</option>
                                <option value="user">User</option>
                            </select>
                    </div>
                    <div className="inputContainer">
                        <input type="submit" className="inputButton" value={"Register"}/>
                    </div>
                </form>
                <div className="errorLabel">
                    <span className={setErrorClass}>{registerMsg}</span>
                </div>
                <div className="authLink">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
                <div className="authLink">
                    Forgot password? <Link to="/forgot-password">Reset password</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
