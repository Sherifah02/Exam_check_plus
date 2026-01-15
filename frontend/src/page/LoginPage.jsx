// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import "../assets/css/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ userId: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGeneratePassword = () => {
    if (!formData.userId) {
      alert("Please enter a User ID first.");
      return;
    }
    alert(`A temporary password has been sent to the email associated with User ID: ${formData.userId}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleRegisterPage = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">

      {/* 1. WELCOME SIDE (Now on the LEFT) */}
      <div className="welcome-side">
        <div className="welcome-text">
          <h1>Welcome To ExamCheck+</h1>
          <p>(Venue Explorer & Result checker)</p>
        </div>
      </div>

      {/* 2. FORM SIDE (Now on the RIGHT) */}
      <div className="form-side">
        <div className="login-header">
          <h2>Login</h2>
          <p>Enter your account details</p>
        </div>

        <form onSubmit={handleLogin}>

          {/* USER ID */}
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="text"
              name="userId"
              placeholder="e.g sa15COM00000"
              value={formData.userId}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* GENERATE PASSWORD BUTTON */}
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="generate-btn"
          >
            Generate Password
          </button>

          {/* PASSWORD FIELD */}
          <div className="form-group">
            <label className="form-label">Temporary Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter the code sent to email"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button type="submit" className="primary-btn">
            Login
          </button>

          {/* ADMIN LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleAdminLogin}
            className="secondary-btn"
          >
            Login as Admin
          </button>

          {/* REGISTER LINK */}
          <div className="register-footer">
            Don't have an account?
            <a href="#"
            className="register-link"
            onClick={handleRegisterPage}>
              Register
              </a>
          </div>

        </form>
      </div>

    </div>
  );
};

export default LoginPage;