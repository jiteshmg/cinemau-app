import React, {useState, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
// import '../css/UserLogin.css';
import logo from '../cinemau-logo.png';
import {Link} from 'react-router-dom';

const UserLogin : React.FC = () => {
    const [formData,
        setFormData] = useState({email: '', password: '', remember: false});

    const navigate = useNavigate();
    const apiUrl : string = import.meta.env.VITE_API_URL;
    const handleChange = (e : ChangeEvent < HTMLInputElement >) => {
        const {name, value, checked, type} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox'
                ? checked
                : value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${apiUrl}/login`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });
            console.log("Form submitted:", response);
    
            // Check if login was successful using the 'status' field
            if (response.data.status === "success") {
                console.log("Login successful:", response.data);
    
                // Store the token and user data securely
                localStorage.setItem("token", response.data.data.token);  // Note the nested 'data'
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
    
                // Set default Authorization header for future requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;
    
                // Redirect to dashboard
                navigate("/dashboard");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
                alert(error.response?.data?.message || "Login failed. Please try again.");
            } else {
                console.error("An unexpected error occurred:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to the registration page
    };

    return (
        <div className="login-center-container">
            <div className="login-container">
                <div className="banner">
                    <img src={logo} alt="Cinemau"/>
                </div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input-field"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="remember" className="checkbox-label">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}/>
                            Remember me
                        </label>
                    </div>
                    <button type="submit" className="btn login-btn">Login</button>
                </form>
                <p>
                    Don't have an account?
                    <Link to="/register" className="register-link">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;
