import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);

            alert(response.data.message);

            navigate("/dashboard");

        } catch (error) {

            alert("Invalid Email or Password");

            console.log(error);

        }

    };

    return (

        <div className="login-container">

            <h2>Expense Tracker</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </div>

                <br />

                <div>

                    <label>Password</label>
                    <br />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>

                <br />

                <button type="submit">

                    Login

                </button>

            </form>

            <br />

            <p>

                Don't have an account?

                <Link to="/register">

                    Register

                </Link>

            </p>

        </div>

    );

}

export default Login;