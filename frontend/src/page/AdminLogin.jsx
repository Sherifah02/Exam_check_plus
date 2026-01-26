import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/login.css";
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Admin User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setErrors(prev => ({
          ...prev,
          general: response.message || 'Login failed. Please check your credentials.'
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred during login. Please try again.'
      }));
       setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
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
          <p>(Admin Portal)</p>
        </div>
        <div className="welcome-info">
          <div className="info-card">
            <Shield size={24} />
            <div>
              <h4>Admin Portal</h4>
              <p>Manage student results, venues, and system configurations</p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="form-side">
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Enter your admin credentials</p>
        </div>

        {errors.general && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* User ID */}
          <div className="form-group">
            <label className="form-label">
              <Shield size={18} style={{ marginRight: '8px' }} />
              Admin User ID
            </label>
            <input
              type="text"
              name="email"
              placeholder="e.g. ADMIN/001"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={isLoading}
              autoFocus
            />
            {errors.email && (
              <div className="field-error">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={18} style={{ marginRight: '8px' }} />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Student Login Button */}
          <button
            type="button"
            onClick={handleStudentLogin}
            className="secondary-btn"
            disabled={isLoading}
          >
            Login as Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;