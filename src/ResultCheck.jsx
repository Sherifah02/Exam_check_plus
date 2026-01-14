import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import {  
  User, Menu, ShieldCheck, LayoutDashboard, Settings, LogOut,  
  ClipboardCheck, Download, AlertCircle, ArrowLeft, Phone, X
} from 'lucide-react'; 

import { useState } from 'react';
 
const ResultCheck = () => {

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STATE ---
  // ID is hardcoded and read-only as requested
  const [studentId] = useState("USR-2024-8892"); 
  const [viewState, setViewState] = useState('input'); // 'input', 'result', 'error'
  
  // --- MOCK DATA ---
  const resultData = {
      name: "Abdulkareem Sherifah",
      level: "200",
      semester: "2nd Semester, 2023/2024",
      courses: [
          { code: "SWE 2315", title: "System Analysis & Design", score: 82, grade: "A" },
          { code: "CSC 2301", title: "Data Structures", score: 56, grade: "C" },
          { code: "GNS 202",  title: "Peace & Conflict Resolution", score: 74, grade: "B" },
          { code: "MTH 212",  title: "Linear Algebra II", score: 65, grade: "B" },
          { code: "CSC 2304", title: "Database Management", score: 45, grade: "D" }
      ]
  };

  // --- HANDLERS ---
  const handleCheckResult = () => {
    // Logic: In a real app, you would fetch from DB here.
    // For demo: We assume if ID exists, results are out. 
    // You can toggle this to 'error' to test the "Not out yet" screen.
    const resultsReleased = true; 

    if (resultsReleased) {
        setViewState('result');
    } else {
        setViewState('error');
    }
  };

  const handleDownload = () => {
    alert("Downloading Result Slip as PDF...");
    // In a real app, you would use a library like 'html2canvas' or 'jspdf' here
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => navigate('/');
  const cancelLogout = () => setShowLogoutModal(false);

  // Helper for Grade Color
  const getGradeClass = (grade) => {
      if(grade === 'A') return 'grade-A';
      if(grade === 'B') return 'grade-B';
      if(grade === 'C') return 'grade-C';
      if(grade === 'D') return 'grade-D';
      return 'grade-F';
  };

  return ( 
    <div className="dashboard-container"> 
       
       {/* LOGOUT MODAL */}
       {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Log Out</button>
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
          <span>ExamCheck+</span> 
        </div> 
 
        <nav className="sidebar-menu"> 
          <div className="sidebar-item" onClick={() => navigate('/dashboard')}> 
            <LayoutDashboard size={20} /> 
            <span>Dashboard</span> 
          </div> 
          <div className="sidebar-item" onClick={() => navigate('/profile')}> 
            <User size={20} /> 
            <span>Profile</span> 
          </div> 
          <div className="sidebar-item" onClick={() => navigate('/contact')}> 
            <Phone size={20} /> 
            <span>Contact</span> 
          </div>
          <div style= {{ marginTop: 'auto' }} className="sidebar-item" onClick={handleLogoutClick}> 
            <LogOut size={20} /> 
            <span>Logout</span> 
          </div> 
        </nav> 
      </aside> 
 
      {/* ======================= */} 
      {/* 2. MAIN CONTENT AREA    */} 
      {/* ======================= */} 
      <main className="desktop-main"> 
        <div className="profile-content-wrapper">
            
            {/* --- VIEW 1: INPUT --- */}
            {viewState === 'input' && (
                <div className="profile-detail-card" style={{maxWidth: '450px'}}>
                    <div className="large-avatar" style={{background: '#0891b2'}}>
                        <ClipboardCheck size={50} />
                    </div>
                    <h2 style={{marginBottom: '20px'}}>Check Results</h2>
                    <p style={{marginBottom: '30px', color: '#64748b'}}>View your semester performance.</p>
                    
                    <div style={{width: '100%', textAlign: 'left', marginBottom: '20px'}}>
                        <label style={{fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block'}}>Your ID:</label>
                        <input 
                            type="text" 
                            value={studentId} 
                            readOnly 
                            className="venue-input input-locked" 
                            style={{width: '100%'}}
                        />
                         <p style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px'}}>
                            *ID is automatically detected from your profile.
                        </p>
                    </div>

                    <button className="venue-button" onClick={handleCheckResult} style={{width: '100%'}}>
                        Check Result
                    </button>
                </div>
            )}

            {/* --- VIEW 2: RESULT DISPLAY --- */}
            {viewState === 'result' && (
                <div className="profile-detail-card" style={{maxWidth: '600px'}}>
                    
                    {/* Header */}
                    <div className="large-avatar" style={{margin: '0 auto 15px auto'}}>
                        <User size={60} />
                    </div>
                    <h2 style={{fontSize: '1.5rem'}}>
                        {resultData.name} <span style={{fontSize: '1rem', color: '#64748b', fontWeight: 'normal'}}>({resultData.level} Lvl)</span>
                    </h2>
                    <p style={{color: '#64748b', marginBottom: '20px'}}>{resultData.semester}</p>

                    <div style={{width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginBottom: '20px'}}></div>

                    {/* Table */}
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}> Course</th>
                                <th style={{textAlign: 'center'}}>Score</th>
                                <th style={{textAlign: 'center'}}>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultData.courses.map((course, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{fontWeight: '600'}}>{course.code}</div>
                                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>{course.title}</div>
                                    </td>
                                    <td>{course.score}</td>
                                    <td>
                                        <span className={`grade-badge ${getGradeClass(course.grade)}`}>
                                            {course.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Download Button */}
                    <button className="venue-button" onClick={handleDownload} style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                        <Download size={20} />
                        Download Result
                    </button>
                    
                    <button className="venue-button-secondary" onClick={() => setViewState('input')} style={{width: '100%', marginTop: '10px'}}>
                        Back
                    </button>
                </div>
            )}

            {/* --- VIEW 3: ERROR (NOT OUT YET) --- */}
            {viewState === 'error' && (
                <div className="profile-detail-card" style={{maxWidth: '450px'}}>
                    <AlertCircle size={60} color="#ef4444" style={{marginBottom: '20px'}} />
                    <h2 style={{color: '#ef4444', marginBottom: '10px'}}>Result Not Out Yet</h2>
                    <p style={{color: '#64748b', marginBottom: '30px'}}>
                        The results for this semester have not been uploaded by the administration yet. Please check back later.
                    </p>
                    <button className="venue-button-secondary" onClick={() => setViewState('input')}>
                        <ArrowLeft size={18} style={{marginRight: '8px', display: 'inline'}} />
                        Back
                    </button>
                </div>
            )}

        </div>
      </main> 
 
      {/* ======================= */} 
      {/* 3. MOBILE APP LAYOUT    */} 
      {/* ======================= */} 
      <div className="mobile-layout"> 
        <div className="mobile-header" style={{display:'flex', alignItems:'center'}}> 
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28}/>
          </button>
          <h1>Results</h1> 
        </div> 

        {/* Mobile View mirrors Desktop content logic */}
        {viewState === 'input' && (
            <div className="profile-detail-card" style={{padding: '25px'}}>
                 <div className="large-avatar" style={{background: '#0891b2'}}>
                    <ClipboardCheck size={40} />
                </div>
                <h3>Check Results</h3>
                <div style={{width: '100%', textAlign: 'left', marginTop: '20px'}}>
                     <label style={{fontWeight: '600', color: '#334155'}}>Your ID:</label>
                     <input type="text" value={studentId} readOnly className="venue-input input-locked" style={{width: '100%', marginTop: '5px'}}/>
                </div>
                <button className="venue-button" onClick={handleCheckResult} style={{width: '100%', marginTop: '20px'}}>Check</button>
            </div>
        )}

        {/* Mobile Result View */}
        {viewState === 'result' && (
             <div className="profile-detail-card" style={{padding: '15px'}}>
                 <div className="large-avatar" style={{width: '80px', height: '80px'}}>
                    <User size={40} />
                </div>
                <h3 style={{marginBottom: '3px'}}>{resultData.name} <span style={{color: '#64748b', fontWeight: 'normal'}}>({resultData.level} Lvl)</span></h3>
                <p style={{fontSize: '0.9rem', color: '#64748b'}}>{resultData.semester}</p>
                
                <table className="result-table" style={{fontSize: '0.8rem'}}>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'center'}}>Course</th>
                            <th style={{textAlign: 'center'}}>Score</th>
                            <th style={{textAlign: 'center'}}>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                         {resultData.courses.map((course, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{fontWeight: '600'}}>{course.code}</div>
                                        <div style={{fontSize: '0.8rem', color: '#64748b'}}>{course.title}</div>
                                    </td>
                                    <td>{course.score}</td>
                                    <td><span className={`grade-badge ${getGradeClass(course.grade)}`}>{course.grade}</span></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <button className="venue-button" onClick={handleDownload}>Download</button>
                <button className="venue-button-secondary" onClick={() => setViewState('input')} style={{marginTop: '10px', width: '100%'}}>Back</button>
             </div>
        )}

        {/* Mobile Error View */}
        {viewState === 'error' && (
            <div className="profile-detail-card">
                 <AlertCircle size={50} color="#ef4444" style={{marginBottom: '15px'}} />
                 <h3 style={{color: '#ef4444'}}>Not Available</h3>
                 <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '20px'}}>Results not yet uploaded.</p>
                 <button className="venue-button-secondary" onClick={() => setViewState('input')}>Back</button>
            </div>
        )}

        {/* SIDEBAR OVERLAY */}
        <div className= {`mobile-sidebar-overlay ${isMobileMenuOpen? 'open' : ''}`}>
        <div style={{position:'absolute', width:'100%', height:'100%'}} onClick={() => setIsMobileMenuOpen(false)} />
        <div className="mobile-sidebar-content">
         <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={28}/>
         </button>

        <div className="sidebar-logo" style={{marginBottom: "30px"}}> 
          <ShieldCheck size={28} /> 
          <span>ExamCheck+</span> 
        </div> 
 
        <nav className="sidebar-menu"> 
          <div className="sidebar-item" onClick={() => navigate('/dashboard')}> 
            <LayoutDashboard size={20} /> 
            <span>Dashboard</span> 
          </div> 
          <div className="sidebar-item" onClick={() => navigate('/profile')}> 
            <User size={20} /> 
            <span>Profile</span> 
          </div> 
          <div className="sidebar-item" onClick={() => navigate('/contact')}> 
            <Phone size={20} /> 
            <span>Contact</span> 
          </div> 
          <div style= {{ marginTop: 'auto' }} className="sidebar-item" onClick={handleLogoutClick}> 
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
export default ResultCheck;