import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // State
  const [regNumber, setRegNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [regError, setRegError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Reg Number, 2: OTP, 3: Success

  const REG_NUMBER_PATTERN = /^[A-Z]{3}\/\d{2}\/[A-Z]{3}\/\d{5}$/;
  const OTP_DURATION = 120; // 2 minutes
  const { verifyStudent, verifyAndCreateUser } = useAuthStore();

  // Timer effect
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  // Auto-focus first OTP input when step 2 renders
  useEffect(() => {
    if (currentStep === 2 && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0].focus();
      }, 100);
    }
  }, [currentStep]);

  // Validation
  const validateRegNumber = useCallback((value) => {
    if (!value) return "";
    if (!REG_NUMBER_PATTERN.test(value)) {
      return "Invalid format. Use: FAC/YR/DEPT/NUM (e.g., CST/21/COM/00736)";
    }
    return "";
  }, []);

  // Handlers
  const handleRegNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    setRegNumber(value);
    setRegError(validateRegNumber(value));
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Only allow single digits
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only accept 6-digit numbers
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setOtpError("");
      // Focus last input
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();

    const error = validateRegNumber(regNumber);
    if (error) {
      setRegError(error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyStudent({ reg_number: regNumber });
      if (!response.success) {
        // Show error message if verification fails
        setRegError(
          response.message || "Registration number verification failed",
        );
        return;
      }
      // Move to step 2
      setCurrentStep(2);
      setOtpTimer(OTP_DURATION);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setRegError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const otpString = otp.join("");
      const response = await verifyAndCreateUser({
        reg_number: regNumber,
        otp: otpString,
      });

      // Check if response is successful
      if (response && response.success) {
        // Move to success step
        toast.info("Your temporary password has been sent to your email");
        setCurrentStep(3);
      } else {
        setOtpError(response?.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    handleSendOtp();
  };

  const handleBackToRegNumber = () => {
    setCurrentStep(1);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add CSS classes for better styling
  const containerStyles = {
    stepContainer: {
      animation: "fadeIn 0.3s ease-in-out",
    },
    otpInput: {
      width: "55px",
      height: "65px",
      textAlign: "center",
      fontSize: "1.875rem",
      border: "2px solid #d1d5db",
      borderRadius: "12px",
      backgroundColor: "white",
      transition: "border-color 0.2s",
      outline: "none",
    },
    otpInputError: {
      borderColor: "#ef4444",
    },
  };

  // --- STEP 1 CONTAINER: REGISTRATION NUMBER ---
  const renderStep1 = () => (
    <div className="step-container" style={containerStyles.stepContainer}>
      <div className="login-header">
        <h2>Student Registration</h2>
        <p>Step 1: Enter your registration number</p>
      </div>

      <form onSubmit={handleSendOtp}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-number">
            Registration Number *
          </label>
          <input
            id="reg-number"
            type="text"
            value={regNumber}
            onChange={handleRegNumberChange}
            className="form-input"
            placeholder="CST/21/COM/00736"
            disabled={isLoading}
            autoFocus
            aria-invalid={!!regError}
            aria-describedby={regError ? "reg-error" : "reg-hint"}
            style={regError ? { borderColor: "#ef4444" } : {}}
          />
          {regError && (
            <div
              id="reg-error"
              className="error-message"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#ef4444",
                fontSize: "0.875rem",
                marginTop: "6px",
              }}
            >
              <AlertCircle size={16} />
              <span>{regError}</span>
            </div>
          )}
          <p
            id="reg-hint"
            style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "6px" }}
          >
            Format: Faculty/Year/Department/Number (e.g., CST/21/COM/00736)
          </p>
        </div>

        <button
          type="submit"
          className="primary-btn"
          disabled={!regNumber || !!regError || isLoading}
          style={{ marginTop: "25px" }}
        >
          {isLoading ? "Sending..." : "Send Verification OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="secondary-btn"
          disabled={isLoading}
          style={{ marginTop: "15px", width: "100%" }}
        >
          Back to Login
        </button>
      </form>
    </div>
  );

  // --- STEP 2 CONTAINER: OTP VERIFICATION ---
  const renderStep2 = () => (
    <div className="step-container" style={containerStyles.stepContainer}>
      <div className="login-header">
        <h2>Verify Your Identity</h2>
        <p>Step 2: Enter the OTP sent to your email</p>
      </div>

      <div className="form-group">
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "25px",
            textAlign: "center",
            border: "1px solid #bae6fd",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
            Verifying Registration Number:
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "1.125rem",
              color: "#8b5cf6",
              fontWeight: "600",
            }}
          >
            {regNumber}
          </p>
        </div>

        <label className="form-label" htmlFor="otp-0">
          Enter 6-digit OTP *
        </label>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "20px",
          }}
        >
          We've sent a verification code to your student email
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            margin: "25px 0",
          }}
          onPaste={handleOtpPaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpInputRefs.current[index] = el)}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              disabled={isLoading}
              aria-label={`OTP digit ${index + 1}`}
              className="otp-input"
              style={{
                ...containerStyles.otpInput,
                ...(otpError ? containerStyles.otpInputError : {}),
              }}
            />
          ))}
        </div>

        {otpError && (
          <div
            className="error-message"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              color: "#ef4444",
              fontSize: "0.875rem",
              marginTop: "10px",
            }}
          >
            <AlertCircle size={16} />
            <span>{otpError}</span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              color: otpTimer > 0 ? "#10b981" : "#6b7280",
            }}
          >
            {otpTimer > 0
              ? `Expires in ${formatTime(otpTimer)}`
              : "OTP expired"}
          </span>

          <button
            type="button"
            onClick={handleResendOtp}
            className="secondary-btn"
            style={{ padding: "8px 15px", fontSize: "0.875rem" }}
            disabled={otpTimer > 0 || isLoading}
          >
            {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : "Resend OTP"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleVerifyOtp}
        className="primary-btn"
        disabled={otp.join("").length !== 6 || isLoading}
        style={{ marginTop: "30px" }}
      >
        {isLoading ? "Verifying..." : "Verify & Register"}
      </button>

      <button
        type="button"
        onClick={handleBackToRegNumber}
        className="secondary-btn"
        disabled={isLoading}
        style={{
          marginTop: "15px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <ArrowLeft size={16} />
        Use Different Registration Number
      </button>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="secondary-btn"
        disabled={isLoading}
        style={{ marginTop: "15px", width: "100%" }}
      >
        Back to Login
      </button>
    </div>
  );

  // --- STEP 3 CONTAINER: SUCCESS ---
  const renderSuccess = () => (
    <div className="step-container" style={containerStyles.stepContainer}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <CheckCircle size={72} color="#10b981" strokeWidth={2} />
        </div>
        <h2
          style={{
            fontSize: "1.875rem",
            marginBottom: "10px",
            color: "#1f2937",
            fontWeight: "700",
          }}
        >
          Registration Successful!
        </h2>
        <p
          style={{ color: "#6b7280", marginBottom: "30px", lineHeight: "1.6" }}
        >
          Your account has been created with registration number:
          <br />
          <strong
            style={{
              color: "#8b5cf6",
              fontSize: "1.25rem",
              display: "block",
              marginTop: "10px",
            }}
          >
            {regNumber}
          </strong>
        </p>

        <button
          onClick={() => navigate("/")}
          className="primary-btn"
          style={{ width: "100%", padding: "15px" }}
          autoFocus
        >
          Proceed to Login
        </button>
      </div>
    </div>
  );

  // Render based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderSuccess();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-side">
        <div className="welcome-text">
          <h1>Welcome To ExamCheck+</h1>
          <p>(Venue Explorer & Result checker)</p>
        </div>
      </div>

      <div className="form-side">{renderCurrentStep()}</div>
    </div>
  );
};

export default SignUp;
