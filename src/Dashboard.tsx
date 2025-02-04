import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';

import DashboardHeader from './DashboardHeader';
import MyProfile from './User/MyProfile';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeMenu, setActiveMenu] = useState('Projects');
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  return (
    <div className="dashboard">
      <DashboardHeader onProfileClick={() => setShowProfile(true)}/>
      <div className="dashboard-content">
      {showProfile && <MyProfile onClose={() => setShowProfile(false)} />}
      </div>
    </div>
  );

};

export default Dashboard; 
