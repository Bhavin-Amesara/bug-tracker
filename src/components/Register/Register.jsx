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
    const [msgColor, setMsgColor] = useState("");
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

        fetch("api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.errMessage);
            if (data.errMessage) {
                // setRegisterMsg(data.errMessage);
                // setMsgColor("red");

                mySwal.fire({
                    title: "Error",
                    text: data.errMessage,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            } else {
                console.log("User created successfully");
                setRegisterMsg("User created successfully");
                setMsgColor("green");
                
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
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username here"
                            required
                        />
                    </div>
                    <div className="inputContainer">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email here"
                            required
                        />
                    </div>
                    <div className="inputContainer">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password here"
                            required
                        />
                    </div>
                    <div className="inputContainer">
                        {/* already select  */}
                            <select 
                                id="role" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            required
                            >
                                <option value="">Select a role</option>
                                <option value="developer">Developer</option>
                                <option value="manager">Manager</option>
                                <option value="project manager">Project Manager</option>
                                <option value="user">User</option>
                            </select>
                    </div>
                    <div className="inputContainer">
                        <input type="submit" className="inputButton" value={"Register"}/>
                    </div>
                </form>
                <div className="errorLabel">
                    <span style={{ color: msgColor }}>{registerMsg}</span>
                </div>
                <div className="authLink">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
