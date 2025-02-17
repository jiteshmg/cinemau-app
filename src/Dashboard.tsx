import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';

import DashboardHeader from './DashboardHeader';
import MyProfile from './User/MyProfile';
import ProjectList from './Project/ProjectList';

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
      {!showProfile && activeMenu === 'Projects' && <ProjectList />} {/* Render ProjectList by default */}
      </div>
    </div>
  );

};

export default Dashboard; 
