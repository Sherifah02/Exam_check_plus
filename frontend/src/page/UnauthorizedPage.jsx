import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";
import "../assets/css/UnauthorizedPage.css"; // We'll create this CSS file

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        {/* Icon */}
        <div className="icon-container">
          <ShieldOff size={80} className="icon" />
        </div>

        {/* Title */}
        <h1 className="title">Access Denied</h1>

        {/* Message */}
        <p className="message">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>

        {/* Status Code */}
        <div className="status-code">
          <span>401</span>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            className="btn-primary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} style={{ marginRight: "8px" }} />
            Go Back
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            <Home size={18} style={{ marginRight: "8px" }} />
            Go Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="info-box">
          <p className="info-text">
            <strong>Possible reasons:</strong>
          </p>
          <ul className="reason-list">
            <li>Your session may have expired</li>
            <li>You don't have the required permissions</li>
            <li>You're trying to access a restricted area</li>
            <li>Invalid or missing authentication token</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;