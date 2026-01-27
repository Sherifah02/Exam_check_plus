// import "../assets/css/VenueUploadPage.css";
import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  UploadCloud,
  X,
  Building,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Download,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useGeneralStore } from "../store/genStore";
import { useVenueStore } from "../store/venueStore";
import { useAuthStore } from "../store/authStore";

const VenueUploadPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fileInputRef = useRef(null);

  // State for form data
  const [formData, setFormData] = useState({
    level: "",
    courseCode: "",
    session: "",
    file: null,
  });

  // State for UI
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);

  const {
    levels,
    sessions,
    fetchLevels,
    fetchSessions,
  } = useGeneralStore();

  const { uploadVenueAllocation } = useVenueStore();

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchLevels(),
          fetchSessions(),
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setUploadStatus({
          type: "error",
          message: "Failed to load form data",
          details: "Please refresh the page and try again.",
        });
      }
    };

    loadInitialData();
  }, [fetchLevels, fetchSessions]);

  // Navigation handlers
  const handleDashboardClick = () => navigate("/admin/dashboard");
  const handleProfileClick = () => navigate("/admin/profile");
  const handleResultUpload = () => navigate("/admin/result-upload");

  // Logout handlers
  const handleLogoutClick = () => setShowLogoutModal(true);
       const { logout } = useAuthStore();
      const confirmLogout = async () => {
    const response = await logout();
    console.log(response);
    if (response && !response.success) {
      return;
    }
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutModal(false);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "courseCode" ? value.toUpperCase() : value;

    setFormData(prev => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const allowedExtensions = /\.(csv|xlsx|xls)$/i;

    // Check file type
    if (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
      return "Please upload a CSV or Excel file only";
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileError = validateFile(file);
    if (fileError) {
      setErrors(prev => ({ ...prev, file: fileError }));
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: "" }));

    // Preview file contents (mock data for now)
    const mockData = [
      { regNumber: "CST/21/COM/00750", venue: "ICT Hall A", seatNumber: "A01" },
      { regNumber: "CST/21/COM/00751", venue: "ICT Hall A", seatNumber: "A02" },
      { regNumber: "CST/21/COM/00752", venue: "ICT Hall B", seatNumber: "B01" },
      { regNumber: "CST/21/COM/00753", venue: "ICT Hall B", seatNumber: "B02" },
      { regNumber: "CST/21/COM/00754", venue: "Main Auditorium", seatNumber: "M15" },
    ];

    setPreviewData(mockData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const downloadTemplate = () => {
const templateContent = `course_code,hall,exam_time,reg_number,seat_number
CST101,ICT Hall A,2026-02-10 09:00,CST/21/COM/00750,A01
CST101,ICT Hall A,2026-02-10 09:00,CST/21/COM/00751,A02
CST101,ICT Hall B,2026-02-10 14:00,CST/21/COM/00752,B01
CST101,ICT Hall B,2026-02-10 14:00,CST/21/COM/00753,B02
CST102,Main Auditorium,2026-02-11 09:00,CST/21/COM/00754,M15`;


    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "venue_allocation_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.level.trim()) newErrors.level = "Please select a level";
    if (!formData.courseCode.trim()) newErrors.courseCode = "Please enter a course code";
    if (!formData.session.trim()) newErrors.session = "Please select a session";
    if (!formData.file) newErrors.file = "Please upload a file";

    // Additional validation for course code format
    if (formData.courseCode.trim() && !/^[A-Z]{3}\s?\d{3}$/i.test(formData.courseCode.trim())) {
      newErrors.courseCode = "Please enter a valid course code (e.g., CSC 401 or CSC401)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare FormData
    const apiFormData = new FormData();
    apiFormData.append("level", formData.level);
    apiFormData.append("course_code", formData.courseCode.trim().replace(/\s+/g, ''));
    apiFormData.append("session", formData.session);
    apiFormData.append("venue_file", formData.file);

    setIsLoading(true);
    setUploadStatus(null);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await uploadVenueAllocation(apiFormData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response?.success) {
        setUploadStatus({
          type: "success",
          message: "Venue allocation uploaded successfully!",
          details: response.message || "Venue allocations have been processed and saved.",
        });

        // Reset form after success
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        throw new Error(response?.message || "Upload failed");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus({
        type: "error",
        message: "Upload failed!",
        details: error.message || "Please check your file and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      level: "",
      courseCode: "",
      session: "",
      file: null,
    });
    setPreviewData([]);
    setErrors({});
    setUploadStatus(null);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Safe data accessors
  const safeLevels = Array.isArray(levels) ? levels : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="dashboard-container admin-theme">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
     <aside className="desktop-sidebar">
        <div className="sidebar-logo">
          <ShieldCheck size={28} />
          <span>Admin Portal</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-item" onClick={handleDashboardClick}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={handleResultUpload}>
            <FileSpreadsheet size={20} />
            <span>Upload Results</span>
          </div>
          <div className="sidebar-item active" >
            <Building size={20} />
            <span>Upload Venue</span>
          </div>
          <div className="sidebar-item " onClick={()=> navigate("/admin/results/batches")}>
            <FileSpreadsheet size={20} />
            <span>Result Batches</span>
          </div>
          <div className="sidebar-item" onClick={handleProfileClick}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="sidebar-item" onClick={handleLogoutClick}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* Desktop Main Content */}
      <main className="desktop-main">
        {/* Top Bar */}
        <div className="desktop-topbar">
          <div className="top-profile">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <span className="profile-name">Admin User</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>
              <MapPin size={32} />
              Upload Venue Allocations
            </h2>
            <p className="banner-subtitle">
              Upload CSV or Excel files containing venue allocations for specific courses and levels
            </p>
          </div>
        </div>

        {/* Upload Form Section */}
        <div className="upload-content-wrapper">
          <div className="upload-form-section">
            <form onSubmit={handleSubmit}>
              {/* Form Grid */}
              <div className="form-grid">
                {/* Level Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <GraduationCap size={18} />
                    Level *
                  </label>
                  <div className="select-wrapper">
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className={`form-select ${errors.level ? "error" : ""}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Level</option>
                      {safeLevels.map((level) => (
                        <option key={level.id || level._id} value={level.id || level._id}>
                          {level.name || level.levelName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="select-icon" />
                  </div>
                  {errors.level && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.level}
                    </div>
                  )}
                </div>

                {/* Course Code - Text Input */}
                <div className="form-group full-width">
                  <label className="form-label">
                    <BookOpen size={18} />
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className={`form-input ${errors.courseCode ? "error" : ""}`}
                    placeholder="e.g., CSC 401 or CSC401"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  {errors.courseCode && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.courseCode}
                    </div>
                  )}
                  <div className="form-hint">
                    Enter course code in format: ABC 123 or ABC123
                  </div>
                </div>

                {/* Session Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} />
                    Session *
                  </label>
                  <div className="select-wrapper">
                    <select
                      name="session"
                      value={formData.session}
                      onChange={handleInputChange}
                      className={`form-select ${errors.session ? "error" : ""}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Session</option>
                      {safeSessions.map((session) => (
                        <option key={session.id || session._id} value={session.id || session._id}>
                          {session.name || session.sessionName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="select-icon" />
                  </div>
                  {errors.session && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.session}
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="upload-section">
                <label className="form-label">Upload Venue Allocation File *</label>

                <div
                  className={`upload-area ${formData.file ? "has-file" : ""} ${errors.file ? "error" : ""}`}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    style={{ display: "none" }}
                    disabled={isLoading}
                  />

                  {formData.file ? (
                    <div className="file-info">
                      <FileSpreadsheet size={48} color="#10b981" />
                      <div className="file-details">
                        <h4>{formData.file.name}</h4>
                        <p>{(formData.file.size / 1024).toFixed(2)} KB</p>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, file: null }));
                            setPreviewData([]);
                          }}
                          disabled={isLoading}
                        >
                          <X size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={48} className="upload-icon" />
                      <h3>Drag & Drop or Click to Upload</h3>
                      <p>Supported formats: CSV, XLSX, XLS (Max 5MB)</p>
                    </>
                  )}
                </div>

                {errors.file && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.file}
                  </div>
                )}

                {/* File Preview */}
                {previewData.length > 0 && (
                  <div className="preview-section">
                    <h4>File Preview (Sample Data)</h4>
                    <div className="preview-table-container">
                      <table className="preview-table">
                        <thead>
                          <tr>
                            <th>Registration Number</th>
                            <th>Venue</th>
                            <th>Seat Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index}>
                              <td>{row.regNumber}</td>
                              <td>{row.venue}</td>
                              <td>{row.seatNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="preview-note">
                      * Showing sample preview. Your file contains more data.
                    </p>
                  </div>
                )}

                {/* Download Template Button */}
                <button
                  type="button"
                  className="template-btn"
                  onClick={downloadTemplate}
                  disabled={isLoading}
                >
                  <Download size={18} />
                  Download Template
                </button>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading || !formData.file}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      Upload Venue Allocations
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Upload Status */}
            {uploadStatus && (
              <div className={`status-message ${uploadStatus.type}`}>
                {uploadStatus.type === "success" ? (
                  <CheckCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
                <div className="status-content">
                  <h4>{uploadStatus.message}</h4>
                  <p>{uploadStatus.details}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Panel */}
          <div className="instructions-panel">
            <h3><Users size={20} /> Instructions</h3>
            <ul className="instructions-list">
              <li>
                <strong>Select Level:</strong> Choose the academic level for the venue allocation
              </li>
              <li>
                <strong>Enter Course Code:</strong> Type the course code (e.g., CSC 401)
              </li>
              <li>
                <strong>Select Session:</strong> Choose the academic session
              </li>
              <li>
                <strong>Upload File:</strong> Upload a CSV/Excel file with student venue allocations
              </li>
              <li>
                <strong>File Format:</strong> Your CSV should have columns:
                <code>RegistrationNumber, Venue, SeatNumber</code>
              </li>
              <li>
                <strong>Download Template:</strong> Use the template to ensure proper formatting
              </li>
            </ul>

            <div className="info-box">
              <AlertCircle size={18} />
              <div>
                <strong>Important:</strong> Ensure all registration numbers in your file
                exist in the system before uploading.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
          <h1>Upload Venue</h1>
        </div>

        {/* Mobile Profile */}
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={24} />
          </div>
          <div>
            <p className="profile-welcome">Welcome, Admin</p>
          </div>
        </div>

        {/* Mobile Form */}
        <div className="upload-content-wrapper mobile">
          <form onSubmit={handleSubmit} className="mobile-form">
            {/* Level Selection */}
            <div className="form-group">
              <label className="form-label">Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className={`form-select ${errors.level ? "error" : ""}`}
                disabled={isLoading}
              >
                <option value="">Select Level</option>
                {safeLevels.map((level) => (
                  <option key={level.id || level._id} value={level.id || level._id}>
                    {level.name || level.levelName}
                  </option>
                ))}
              </select>
              {errors.level && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.level}
                </div>
              )}
            </div>

            {/* Course Code - Text Input */}
            <div className="form-group full-width">
              <label className="form-label">Course Code *</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className={`form-input ${errors.courseCode ? "error" : ""}`}
                placeholder="e.g., CSC 401 or CSC401"
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.courseCode && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.courseCode}
                </div>
              )}
              <div className="form-hint">
                Format: ABC 123 or ABC123
              </div>
            </div>

            {/* Session Selection */}
            <div className="form-group">
              <label className="form-label">Session *</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                className={`form-select ${errors.session ? "error" : ""}`}
                disabled={isLoading}
              >
                <option value="">Select Session</option>
                {safeSessions.map((session) => (
                  <option key={session.id || session._id} value={session.id || session._id}>
                    {session.name || session.sessionName}
                  </option>
                ))}
              </select>
              {errors.session && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.session}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="upload-section">
              <label className="form-label">Upload File *</label>
              <div
                className={`upload-area ${formData.file ? "has-file" : ""} ${errors.file ? "error" : ""}`}
                onClick={() => !isLoading && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                  disabled={isLoading}
                />

                {formData.file ? (
                  <div className="file-info">
                    <FileSpreadsheet size={32} color="#10b981" />
                    <div className="file-details">
                      <h4>{formData.file.name}</h4>
                      <p>{(formData.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className="upload-icon" />
                    <h3>Tap to Upload</h3>
                    <p>CSV, XLSX, XLS (Max 5MB)</p>
                  </>
                )}
              </div>

              {errors.file && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.file}
                </div>
              )}
            </div>

            {/* Mobile Action Buttons */}
            <div className="mobile-action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="button"
                className="template-btn"
                onClick={downloadTemplate}
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                <Download size={18} />
                Template
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading || !formData.file}
                style={{ flex: 2 }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    Upload
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Mobile Status Message */}
          {uploadStatus && (
            <div className={`status-message ${uploadStatus.type}`}>
              {uploadStatus.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <div className="status-content">
                <h4>{uploadStatus.message}</h4>
                <p>{uploadStatus.details}</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Menu */}
        <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? "open" : ""}`}>
          <div
            className="overlay-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mobile-sidebar-content">
            <button
              className="close-menu-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <div className="sidebar-logo">
              <ShieldCheck size={28} />
              <span>Admin Portal</span>
            </div>

            <nav className="sidebar-menu">
              <div className="sidebar-item" onClick={handleDashboardClick}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div className="sidebar-item" onClick={handleResultUpload}>
                <FileSpreadsheet size={20} />
                <span>Upload Results</span>
              </div>
              <div className="sidebar-item active">
                <MapPin size={20} />
                <span>Upload Venue</span>
              </div>
              <div className="sidebar-item" onClick={handleProfileClick}>
                <User size={20} />
                <span>Profile</span>
              </div>

              <div className="sidebar-item" onClick={handleLogoutClick}>
                <LogOut size={20} />
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueUploadPage;