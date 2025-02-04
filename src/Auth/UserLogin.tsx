import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import '../css/UserLogin.css'; 
import logo from '../cinemau-logo.png';
import { Link } from 'react-router-dom';


const UserLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const response = await axios.post('http://localhost:8000/api/login', formData);
    
      // Check if login was successful
      if (response.data.success) {
        console.log('Login successful:', response.data);
    
        // Save user data and token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        alert(response.data.message);
      }
    }  catch (error) {
      if (error instanceof Error) {
        // Handle JavaScript errors
        console.error('Error during login:', error.message);
        alert(error.message || 'An error occurred. Please try again.');
      }else {
        // Handle unexpected errors
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again.');
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
      <img src={logo} alt="Cinemau" />
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
            className="input-field"
          />
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
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="remember" className="checkbox-label">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Remember me
          </label>
        </div>
        <button type="submit" className="btn login-btn">Login</button>
      </form>
      <p>
          Don't have an account? <Link to="/register" className="register-link">
          Register
          </Link>
        </p>
    </div>
    </div>
  );
};

export default UserLogin;
