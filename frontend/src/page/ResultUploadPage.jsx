import "../assets/css/DashboardPage.css";
import "../assets/css/ResultUploadPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  UploadCloud,
  X,
  GraduationCap,
  Building,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Download,
  ChevronDown,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useGeneralStore } from "../store/genStore";
import { useResultStore } from "../store/resultStore";

const ResultUploadPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fileInputRef = useRef(null);

  // State for form data
  const [formData, setFormData] = useState({
    level: "",
    department: "",
    semester: "",
    session: "",
    courseCode: "",
    file: null,
  });

  // State for UI
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);

  const {
    semesters,
    levels,
    departments,
    sessions,
    fetchLevels,
    fetchDepartments,
    fetchSemesters,
    fetchSessions,
  } = useGeneralStore();

  const { uploadResult } = useResultStore();

  useEffect(() => {
    const runGeneralStore = async () => {
      await fetchLevels();
      await fetchDepartments();
      await fetchSemesters();
      await fetchSessions();
    };
    runGeneralStore();
  }, []);

  // Navigation handlers
  const handleDashboardClick = () => {
    navigate("/admin/dashboard");
  };

  const handleProfileClick = () => {
    navigate("/admin-profile");
  };

  const handleStudentVerification = () => {
    navigate("/admin-verification");
  };

  const handleVenueUpload = () => {
    navigate("/admin/upload-venue");
  };

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseCode" ? value.toUpperCase() : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(csv|xlsx|xls)$/)
      ) {
        setErrors((prev) => ({
          ...prev,
          file: "Please upload a CSV or Excel file only",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: "" }));

      // Simulate file preview
      const mockData = [
        { regNumber: "CST/21/COM/00750", score: 85, grade: "A" },
        { regNumber: "CST/21/COM/00751", score: 72, grade: "B" },
        { regNumber: "CST/21/COM/00752", score: 90, grade: "A" },
        { regNumber: "CST/21/COM/00753", score: 68, grade: "C" },
        { regNumber: "CST/21/COM/00754", score: 95, grade: "A" },
      ];
      setPreviewData(mockData);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] },
      };
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const downloadTemplate = () => {
    const templateContent = `CourseTitle,CourseCode,RegNumber,Score,Grade
Introduction to Computer Science,CST101,CST/21/COM/00750,85,A
Introduction to Computer Science,CST101,CST/21/COM/00751,72,B
Introduction to Computer Science,CST101,CST/21/COM/00752,90,A`;

    const blob = new Blob([templateContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "result_upload_template.csv";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.level) newErrors.level = "Please select a level";
    if (!formData.department) newErrors.department = "Please select a department";
    if (!formData.semester) newErrors.semester = "Please select a semester";
    if (!formData.session) newErrors.session = "Please select a session";
    if (!formData.file) newErrors.file = "Please upload a file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create FormData for API request
    const apiFormData = new FormData();
    apiFormData.append("level_id", formData.level);
    apiFormData.append("department_id", formData.department);
    apiFormData.append("semester_id", formData.semester);
    apiFormData.append("session_id", formData.session);

    if (formData.courseCode && formData.courseCode.trim()) {
      apiFormData.append("course_code", formData.courseCode.trim());
    }

    apiFormData.append("result_file", formData.file);

    setIsLoading(true);
    setUploadStatus(null);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await uploadResult(apiFormData);

      if (!response.success) {
        throw new Error(response.message || "Upload failed");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadStatus({
        type: "success",
        message: "Results uploaded successfully!",
        details: response.message || "All results have been saved to the database.",
      });

      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          level: "",
          department: "",
          semester: "",
          session: "",
          courseCode: "",
          file: null,
        });
        setPreviewData([]);
        setUploadProgress(0);
      }, 3000);
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

  const handleReset = () => {
    setFormData({
      level: "",
      department: "",
      semester: "",
      session: "",
      courseCode: "",
      file: null,
    });
    setPreviewData([]);
    setErrors({});
    setUploadStatus(null);
    setUploadProgress(0);
  };

  return (
    <div className="dashboard-container admin-theme">
      {/* ======================= */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ======================= */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Log Out?</h3>
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

      {/* ======================= */}
      {/* 1. DESKTOP SIDEBAR      */}
      {/* ======================= */}
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
          <div className="sidebar-item active">
            <FileSpreadsheet size={20} />
            <span>Upload Results</span>
          </div>
          <div className="sidebar-item" onClick={handleProfileClick}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div
            style={{ marginTop: "auto" }}
            className="sidebar-item"
            onClick={handleLogoutClick}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* ======================= */}
      {/* 2. DESKTOP MAIN CONTENT */}
      {/* ======================= */}
      <main className="desktop-main">
        {/* Top Bar */}
        <div className="desktop-topbar">
          <div className="top-profile">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <span className="font-bold text-gray-700">Admin User</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>
              <FileSpreadsheet size={32} style={{ marginRight: "12px" }} />
              Upload Student Results
            </h2>
            <p className="opacity-90">
              Upload CSV or Excel files containing student results for a
              specific course
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="upload-content-wrapper">
          <div className="upload-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Level Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <GraduationCap size={18} style={{ marginRight: "8px" }} />
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
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
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

                {/* Department Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <Building size={18} style={{ marginRight: "8px" }} />
                    Department *
                  </label>
                  <div className="select-wrapper">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`form-select ${errors.department ? "error" : ""}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="select-icon" />
                  </div>
                  {errors.department && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.department}
                    </div>
                  )}
                </div>

                {/* Semester Selection */}
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <div className="select-wrapper">
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className={`form-select ${errors.semester ? "error" : ""}`}
                      disabled={isLoading}
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="select-icon" />
                  </div>
                  {errors.semester && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.semester}
                    </div>
                  )}
                </div>

                {/* Session Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} style={{ marginRight: "8px" }} />
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
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.name}
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

                {/* Course Code */}
                <div className="form-group full-width">
                  <label className="form-label">Course Code </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., CSC 401"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="upload-section">
                <label className="form-label">Upload Results File *</label>

                <div
                  className={`upload-area ${formData.file ? "has-file" : ""} ${errors.file ? "error" : ""}`}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
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
                            setFormData((prev) => ({ ...prev, file: null }));
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

                {/* Download Template Button */}
                <button
                  type="button"
                  className="template-btn"
                  onClick={downloadTemplate}
                  disabled={isLoading}
                >
                  <Download size={18} style={{ marginRight: "8px" }} />
                  Download Template
                </button>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleReset}
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
                      <UploadCloud size={18} style={{ marginRight: "8px" }} />
                      Upload Results
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
        </div>
      </main>

      {/* ======================= */}
      {/* 3. MOBILE APP LAYOUT    */}
      {/* ======================= */}
      <div className="mobile-layout">
        <div
          className="mobile-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
          <h1>Upload Results</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome, Admin</p>
          </div>
        </div>

        {/* Mobile Form */}
        <div className="upload-content-wrapper mobile">
          <form onSubmit={handleSubmit} className="mobile-form">
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
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
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

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`form-select ${errors.department ? "error" : ""}`}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.department}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className={`form-select ${errors.semester ? "error" : ""}`}
                disabled={isLoading}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.semester}
                </div>
              )}
            </div>

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
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
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

            <div className="form-group">
              <label className="form-label">Course Code </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., CSC 401"
                disabled={isLoading}
              />
            </div>

            {/* File Upload */}
            <div className="upload-section">
              <label className="form-label">Upload Results File *</label>
              <div
                className={`upload-area ${formData.file ? "has-file" : ""} ${errors.file ? "error" : ""}`}
                onClick={() => !isLoading && fileInputRef.current?.click()}
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

            {/* Mobile Actions */}
            <div className="mobile-action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading || !formData.file}
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

        {/* SLIDE OUT MOBILE MENU */}
        <div
          className={`mobile-sidebar-overlay ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div
            style={{ position: "absolute", width: "100%", height: "100%" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mobile-sidebar-content">
            <button
              className="close-menu-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <div className="sidebar-logo" style={{ marginBottom: "30px" }}>
              <ShieldCheck size={28} />
              <span>Admin Portal</span>
            </div>

            <nav className="sidebar-menu">
              <div className="sidebar-item" onClick={handleDashboardClick}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div className="sidebar-item active">
                <FileSpreadsheet size={20} />
                <span>Upload Results</span>
              </div>
              <div className="sidebar-item" onClick={handleProfileClick}>
                <User size={20} />
                <span>Profile</span>
              </div>
              <div
                style={{ marginTop: "auto" }}
                className="sidebar-item"
                onClick={handleLogoutClick}
              >
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

export default ResultUploadPage;