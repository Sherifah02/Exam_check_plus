import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronDown,
  Calendar,
  GraduationCap,
  Building,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

import { useState, useEffect } from "react";
import { useResultStore } from "../store/resultStore";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";


const AdminResultBatches = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // State for batches and UI
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    level: "",
    session: "",
    semester: "",
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get result store functions
  const { fetchResultBatches, deleteResultBatch, downloadResults } = useResultStore();

  // Load batches on mount
  useEffect(() => {
    loadBatches();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, batches]);

  const loadBatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock data - replace with actual API call
      // const mockBatches = [
      //   {
      //     id: "b7f3a1c2-d4e5-4f67-8901-234567890abc",
      //     department: "Computer Science",
      //     level: "300",
      //     session: "2024/2025",
      //     semester: "First",
      //     course_code: "CST301",
      //     course_title: "Algorithms",
      //     created_at: "2026-01-10T09:20:11.000Z",
      //     total_students: 45,
      //     processed: 45,
      //     status: "completed",
      //   },
      //   {
      //     id: "c8g4b2d3-e5f6-5g78-9012-34567890abcd",
      //     department: "Computer Science",
      //     level: "400",
      //     session: "2024/2025",
      //     semester: "Second",
      //     course_code: "CST401",
      //     course_title: "Artificial Intelligence",
      //     created_at: "2026-01-15T14:30:25.000Z",
      //     total_students: 38,
      //     processed: 38,
      //     status: "completed",
      //   },
      //   {
      //     id: "d9h5c3e4-f6g7-6h89-0123-4567890abcde",
      //     department: "Mathematics",
      //     level: "200",
      //     session: "2023/2024",
      //     semester: "First",
      //     course_code: "MAT201",
      //     course_title: "Calculus II",
      //     created_at: "2025-12-05T11:15:42.000Z",
      //     total_students: 52,
      //     processed: 50,
      //     status: "partial",
      //   },
      //   {
      //     id: "e0i6d4f5-g7h8-7i90-1234-567890abcdef",
      //     department: "Physics",
      //     level: "100",
      //     session: "2023/2024",
      //     semester: "Second",
      //     course_code: "PHY102",
      //     course_title: "Modern Physics",
      //     created_at: "2025-11-20T16:45:18.000Z",
      //     total_students: 60,
      //     processed: 0,
      //     status: "pending",
      //   },
      //   {
      //     id: "f1j7e5g6-h8i9-8j01-2345-67890abcdefg",
      //     department: "Computer Science",
      //     level: "300",
      //     session: "2024/2025",
      //     semester: "First",
      //     course_code: "CST302",
      //     course_title: "Database Systems",
      //     created_at: "2026-01-12T10:05:33.000Z",
      //     total_students: 48,
      //     processed: 48,
      //     status: "completed",
      //   },
      //   {
      //     id: "g2k8f6h7-i9j0-9k12-3456-7890abcdefgh",
      //     department: "Electrical Engineering",
      //     level: "400",
      //     session: "2024/2025",
      //     semester: "Second",
      //     course_code: "EEE401",
      //     course_title: "Power Systems",
      //     created_at: "2026-01-18T13:20:47.000Z",
      //     total_students: 42,
      //     processed: 42,
      //     status: "completed",
      //   },
      //   {
      //     id: "h3l9g7i8-j0k1-0l23-4567-890abcdefghi",
      //     department: "Computer Science",
      //     level: "200",
      //     session: "2023/2024",
      //     semester: "First",
      //     course_code: "CST201",
      //     course_title: "Data Structures",
      //     created_at: "2025-12-15T09:30:55.000Z",
      //     total_students: 55,
      //     processed: 54,
      //     status: "partial",
      //   },
      //   {
      //     id: "i4m0h8j9-k1l2-1m34-5678-90abcdefghij",
      //     department: "Chemistry",
      //     level: "100",
      //     session: "2023/2024",
      //     semester: "Second",
      //     course_code: "CHE102",
      //     course_title: "Organic Chemistry",
      //     created_at: "2025-11-25T15:10:29.000Z",
      //     total_students: 65,
      //     processed: 65,
      //     status: "completed",
      //   },
      // ];


      const response = await fetchResultBatches();
      setBatches(response.data || response);

      // setBatches(mockBatches);
      // setFilteredBatches(mockBatches);
    } catch (error) {
      console.error("Failed to load batches:", error);
      setError("Failed to load result batches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...batches];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(batch =>
        batch.course_code.toLowerCase().includes(searchLower) ||
        batch.course_title.toLowerCase().includes(searchLower) ||
        batch.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(batch => batch.department === filters.department);
    }

    // Apply level filter
    if (filters.level) {
      filtered = filtered.filter(batch => batch.level === filters.level);
    }

    // Apply session filter
    if (filters.session) {
      filtered = filtered.filter(batch => batch.session === filters.session);
    }

    // Apply semester filter
    if (filters.semester) {
      filtered = filtered.filter(batch => batch.semester === filters.semester);
    }

    // Apply status filter


    setFilteredBatches(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get unique values for filters
  const departments = [...new Set(batches.map(batch => batch.department))];
  const levels = [...new Set(batches.map(batch => batch.level))];
  const sessions = [...new Set(batches.map(batch => batch.session))];
  const semesters = [...new Set(batches.map(batch => batch.semester))];

  // Calculate pagination
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatches = filteredBatches.slice(startIndex, endIndex);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style


  // Navigation handlers
  const handleDashboardClick = () => navigate("/admin/dashboard");
  const handleResultUpload = () => navigate("/admin/upload-result");
  const handleVenueUpload = () => navigate("/admin/upload-venue");
  const handleProfileClick = () => navigate("/admin/profile");

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

  // Action handlers
  const handleViewBatch = (batchId) => {
    navigate(`/admin/batch/${batchId}`);
  };

  const handleDownloadBatch = async (batchId) => {
    try {
      await downloadResults(batchId);
      // API should trigger file download
    } catch (error) {
      console.error("Failed to download batch:", error);
      alert("Failed to download batch. Please try again.");
    }
  };

  const handleDeleteClick = (batchId) => {
    setShowDeleteModal(batchId);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    try {
     const response = await deleteResultBatch(showDeleteModal);
    if(!response.success)return
     // Remove from local state
      setBatches(batches.filter(batch => batch.id !== showDeleteModal));
      toast.success("Batch deleted successfully!");
    } catch (error) {
      console.error("Failed to delete batch:", error);
      alert("Failed to delete batch. Please try again.");
    } finally {
      setShowDeleteModal(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      department: "",
      level: "",
      session: "",
      semester: "",
      status: "",
    });
  };

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: "#dc2626" }}>Delete Batch</h3>
            <p>Are you sure you want to delete this result batch? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn-confirm" style={{ backgroundColor: "#dc2626" }} onClick={confirmDelete}>
                Delete
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
          <div className="sidebar-item" onClick={handleVenueUpload}>
            <Building size={20} />
            <span>Upload Venue</span>
          </div>
          <div className="sidebar-item active">
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
              <FileSpreadsheet size={32} />
              Result Batches
            </h2>
            <p className="banner-subtitle">
              View and manage all uploaded result batches
            </p>
          </div>
          <button
            onClick={loadBatches}
            className="refresh-btn"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? "spinning" : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by course code, title, or department..."
              disabled={isLoading}
            />
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>
                <Building size={16} />
                Department
              </label>
              <div className="select-wrapper">
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  disabled={isLoading}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>
                <GraduationCap size={16} />
                Level
              </label>
              <div className="select-wrapper">
                <select
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  disabled={isLoading}
                >
                  <option value="">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level} Level</option>
                  ))}
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>
                <Calendar size={16} />
                Session
              </label>
              <div className="select-wrapper">
                <select
                  name="session"
                  value={filters.session}
                  onChange={handleFilterChange}
                  disabled={isLoading}
                >
                  <option value="">All Sessions</option>
                  {sessions.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>Semester</label>
              <div className="select-wrapper">
                <select
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  disabled={isLoading}
                >
                  <option value="">All Semesters</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem} Semester</option>
                  ))}
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <div className="select-wrapper">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  disabled={isLoading}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="clear-filters-btn"
              disabled={isLoading}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="content-section">
          <div className="section-header">
            <h3>
              Result Batches
              <span className="count-badge">
                {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''}
              </span>
            </h3>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="spinning" />
              <p>Loading result batches...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={48} color="#ef4444" />
              <h4>Failed to Load Batches</h4>
              <p>{error}</p>
              <button onClick={loadBatches} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="empty-state">
              <FileSpreadsheet size={48} color="#94a3b8" />
              <h4>No Result Batches Found</h4>
              <p>
                {Object.values(filters).some(f => f)
                  ? "No batches match your filters. Try adjusting your search criteria."
                  : "No result batches have been uploaded yet."}
              </p>
              {Object.values(filters).some(f => f) && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="table-container">
                <table className="batches-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Department</th>
                      <th>Level</th>
                      <th>Session</th>

                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBatches.map((batch) => {

                      return (
                        <tr key={batch.id}>
                          <td>
                            <div className="course-info">
                              <div className="course-code">{batch.course_code}</div>
                              <div className="course-title">{batch.course_title}</div>
                            </div>
                          </td>
                          <td>
                            <div className="department-info">
                              <Building size={14} />
                              {batch.department}
                            </div>
                          </td>
                          <td>
                            <div className="level-info">
                              <GraduationCap size={14} />
                              {batch.level} Level
                            </div>
                          </td>
                          <td>
                            <div className="session-info">
                              <Calendar size={14} />
                              {batch.session} - {batch.semester}
                            </div>
                          </td>


                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleDeleteClick(batch.id)}
                                className="action-btn delete-btn"
                                title="Delete Batch"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
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
          <h1>Result Batches</h1>
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

        {/* Mobile Content */}
        <div className="mobile-content">
          {/* Mobile Filters */}
          <div className="mobile-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search batches..."
                disabled={isLoading}
              />
            </div>

            <div className="filter-accordion">
              <div className="accordion-header">
                <Filter size={18} />
                <span>Filters</span>
                {Object.values(filters).some(f => f) && (
                  <span className="filter-count">
                    {Object.values(filters).filter(f => f).length}
                  </span>
                )}
              </div>

              <div className="accordion-content">
                <div className="mobile-filter-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    disabled={isLoading}
                  >
                    <option value="">All</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-filter-group">
                  <label>Level</label>
                  <select
                    name="level"
                    value={filters.level}
                    onChange={handleFilterChange}
                    disabled={isLoading}
                  >
                    <option value="">All</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level} Level</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-filter-group">
                  <label>Session</label>
                  <select
                    name="session"
                    value={filters.session}
                    onChange={handleFilterChange}
                    disabled={isLoading}
                  >
                    <option value="">All</option>
                    {sessions.map(session => (
                      <option key={session} value={session}>{session}</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-filter-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    disabled={isLoading}
                  >
                    <option value="">All</option>
                    <option value="completed">Completed</option>
                    <option value="partial">Partial</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {Object.values(filters).some(f => f) && (
                  <button
                    onClick={clearFilters}
                    className="clear-filters-btn"
                    disabled={isLoading}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile List */}
          {isLoading ? (
            <div className="mobile-loading">
              <RefreshCw size={24} className="spinning" />
              <p>Loading batches...</p>
            </div>
          ) : error ? (
            <div className="mobile-error">
              <AlertCircle size={32} color="#ef4444" />
              <p>Failed to load batches</p>
              <button onClick={loadBatches} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="mobile-empty">
              <FileSpreadsheet size={40} color="#94a3b8" />
              <p>No batches found</p>
            </div>
          ) : (
            <div className="mobile-batches-list">
              {currentBatches.map((batch) => {

                return (
                  <div key={batch.id} className="mobile-batch-card">
                    <div className="batch-header">
                      <div className="course-code">{batch.course_code}</div>

                    </div>

                    <div className="batch-title">{batch.course_title}</div>

                    <div className="batch-details">
                      <div className="detail-item">
                        <Building size={14} />
                        {batch.department}
                      </div>
                      <div className="detail-item">
                        <GraduationCap size={14} />
                        {batch.level} Level
                      </div>
                      <div className="detail-item">
                        <Calendar size={14} />
                        {batch.session}
                      </div>
                    </div>

                    <div className="batch-date">
                      <Clock size={14} />
                      {formatDate(batch.created_at)}
                    </div>

                    <div className="batch-actions">

                      <button
                        onClick={() => handleDeleteClick(batch.id)}
                        className="mobile-action-btn delete-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="mobile-pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="mobile-pagination-btn"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="mobile-page-info">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="mobile-pagination-btn"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
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
              <div className="sidebar-item" onClick={handleVenueUpload}>
                <Building size={20} />
                <span>Upload Venue</span>
              </div>
              <div className="sidebar-item active">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResultBatches;