// AdminSignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// We reuse the same CSS because the design is identical
import './login.css'; 

const AdminLogin = () => {
  const navigate = useNavigate();
  // Only User ID state is needed now
  const [userId, setUserId] = useState('');

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please enter your Admin User ID");
      return;
    }
    navigate('/admin-dashboard');
  };

  const handleStudentLogin = () => {
    navigate('/'); 
  };

  return (
    <div className="login-container">
      
      {/* WELCOME SIDE */}
      <div className="welcome-side">
        <div className="welcome-text">
          <h1>Welcome To ExamCheck+</h1>
          <p>(Venue Explorer & Result checker)</p>
        </div>
      </div>

      {/* 2. FORM SIDE */}
      <div className="form-side">
        <div className="login-header">
          <h2>Admin Page</h2>
          <p>Enter your admin credentials</p>
        </div>

        <form onSubmit={handleLogin}>
          
          {/* USER ID ONLY */}
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="text"
              name="userId"
              placeholder="e.g. ADMIN/001"
              value={userId}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* MAIN LOGIN BUTTON */}
          <button type="submit" className="primary-btn">
            Login
          </button>

          {/* CHANGED: LOGIN AS STUDENT BUTTON */}
          <button 
            type="button" 
            onClick={handleStudentLogin} 
            className="secondary-btn"
          >
            Login as Student
          </button>

        </form>
      </div>

    </div>
  );
};

export default AdminLogin;