// src/User/UserRegistration.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
// import '../css/UserRegistration.css'; // Ensure the correct CSS path
import logo from '../cinemau-logo.png';

const UserRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation:'',
  });

  const navigate = useNavigate(); // Hook to navigate back to login page

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      console.log(response.data);
      // Handle success (e.g., redirect to login, show message)
    } catch (error) {
      console.error('There was an error!', error);
      // Handle error (e.g., display error message)
    }
  };
  const handleCancelClick = () => {
    navigate('/'); // Navigate back to the login page
  };

  return (
    <div className="registration-center-container">
    <div className="registration-container">
    <div className="banner">
      <img src={logo} alt="Cinemau" />
      </div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
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
          <label htmlFor="password">Confirm Password:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn register-btn">Register</button>
        <button type="button" onClick={handleCancelClick} className="btn cancel-btn">Cancel</button>
      </form>
    </div>
    </div>
  );
};

export default UserRegistration;
