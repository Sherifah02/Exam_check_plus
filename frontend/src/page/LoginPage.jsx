import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generateTempPassword, loginUser } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGeneratePassword = async () => {
    if (!formData.userId.trim()) {
      setError("Please enter a User ID first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await generateTempPassword({
        reg_number: formData.userId,
      });

      if (response && response.success) {
        toast.success(
          "Temporary password has been sent to your registered email.",
        );
      } else {
        setError(
          response?.message || "Failed to generate password. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error generating password:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.userId.trim()) {
      setError("Please enter your User ID.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({
        reg_number: formData.userId,
        temp_password: formData.password,
      });

      if (response && response.success) {
        navigate("/dashboard");
      } else {
        setError(
          response?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  const handleRegisterPage = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    alert(
      "Please use the 'Generate Password' button if you've forgotten your password.",
    );
  };

  return (
    <div
      className="login-container"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* LEFT SIDE - WELCOME  */}
      <div
        className="welcome-side"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div className="welcome-text">
          <h1>Welcome To ExamCheck+</h1>
          <p>(Venue Explorer & Result checker)</p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM (Scrollable) */}
      <div
        className="form-side"
        style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <div className="login-header">
          <h2>Login</h2>
          <p>Enter your account details</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Error Message */}
          {error && (
            <div
              className="error-message"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px",
                backgroundColor: "#fee2e2",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                marginBottom: "15px",
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* USER ID */}
          <div className="form-group">
            <label className="form-label" htmlFor="userId">
              User ID *
            </label>
            <input
              id="userId"
              type="text"
              name="userId"
              placeholder="e.g CST/21/COM/00345"
              value={formData.userId.toUpperCase()}
              onChange={handleInputChange}
              className="form-input"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          {/* GENERATE PASSWORD BUTTON */}
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="secondary-btn"
            disabled={isLoading || !formData.userId.trim()}
            style={{
              marginBottom: "15px",
              width: "100%",
              padding: "12px",
            }}
          >
            {isLoading ? "Generating..." : "Generate Temporary Password"}
          </button>

          {/* PASSWORD FIELD */}
          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#8b5cf6",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                style={{ paddingRight: "40px" }}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "5px",
                }}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="primary-btn"
            disabled={
              isLoading || !formData.userId.trim() || !formData.password.trim()
            }
            style={{ marginTop: "10px" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* ADMIN LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleAdminLogin}
            className="secondary-btn"
            disabled={isLoading}
            style={{ marginTop: "10px" }}
          >
            Login as Admin
          </button>

          {/* REGISTER LINK */}
          <div
            className="register-footer"
            style={{
              marginTop: "20px",
              fontSize: "0.875rem",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleRegisterPage}
              className="register-link"
              disabled={isLoading}
              style={{
                background: "none",
                border: "none",
                color: "#8b5cf6",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.875rem",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
