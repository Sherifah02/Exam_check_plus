// SignUp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import "../assets/css/login.css";

const SignUp = () => {
  const navigate = useNavigate();

  // --- 1. CONFIGURATION ---
  const facultyData = {
    "Faculty of Computing (CST)": [
      { name: "Computer Science", code: "COM" },
      { name: "Cyber Security", code: "CBS" },
      { name: "Information Technology", code: "IT" },
      { name: "Software Engineering", code: "SWE" }
    ],
    "Faculty of Engineering (ENG)": [
      { name: "Civil Engineering", code: "CVE" },
      { name: "Electrical Engineering", code: "EEE" },
      { name: "Mechanical Engineering", code: "MEE" },
      { name: "Mechatronics Engineering", code: "MCE" }
    ],
    "Faculty of Law (LAW)": [
      { name: "Private & Property Law", code: "PPL" },
      { name: "Public Law", code: "PUL" },
      { name: "Commercial Law", code: "CML" }
    ]
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 2015; i--) {
    years.push(i);
  }

  // Expression for format: CST/21/COM/00736
  const regNumberPattern = /^[A-Z]{3}\/\d{2}\/[A-Z]{3}\/\d{5}$/;

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    faculty: '',
    department: '',
    level: '',
    regNumber: '',
    yearOfAdmission: '',
    email: ''
  });

  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [regError, setRegError] = useState('');

  // --- 3. AUTO-UPDATE REG NUMBER LOGIC ---
  useEffect(() => {
    // 1. Extract Faculty Code (e.g., "CST" from "Faculty of Computing (CST)")
    const facultyMatch = formData.faculty.match(/\(([A-Z]+)\)/);
    const facultyCode = facultyMatch ? facultyMatch[1] : "";

    // 2. Extract Year Suffix (e.g., "21" from "2021")
    const yearSuffix = formData.yearOfAdmission ? formData.yearOfAdmission.toString().slice(-2) : "";

    // 3. Get Department Code (e.g., "COM")
    const deptCode = formData.department;

    // Only update if we have at least Faculty and Dept
    if (facultyCode && deptCode && yearSuffix) {
      const prefix = `${facultyCode}/${yearSuffix}/${deptCode}/`;

      // PRESERVE EXISTING NUMBERS:
      // If the user already typed numbers (the suffix), keep them.
      const currentVal = formData.regNumber || "";
      const existingSuffix = currentVal.split('/').pop(); // Get whatever is after the last slash

      // Check if existing suffix looks like partial numbers (so we don't overwrite if it's empty)
      // If the current value doesn't start with the new prefix, update it.
      // But we try to keep the "00736" part if they typed it.
      const isNumericSuffix = /^\d+$/.test(existingSuffix);

      if (isNumericSuffix && existingSuffix.length > 0) {
         setFormData(prev => ({ ...prev, regNumber: prefix + existingSuffix }));
      } else {
         // If no numbers yet, just set the prefix so they can start typing
         // We only set it if the prefix changed to avoid infinite loops or overwriting typing
         if (!currentVal.startsWith(prefix)) {
            setFormData(prev => ({ ...prev, regNumber: prefix }));
         }
      }
    }
  }, [formData.faculty, formData.department, formData.yearOfAdmission]);


  // --- 4. HANDLERS ---
  const handleFacultyChange = (e) => {
    const selectedFaculty = e.target.value;
    setFormData({ ...formData, faculty: selectedFaculty, department: '' });
    setAvailableDepartments(selectedFaculty ? facultyData[selectedFaculty] : []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for Reg Number to Force Uppercase
    if (name === 'regNumber') {
      const upperValue = value.toUpperCase();
      setFormData({ ...formData, [name]: upperValue });

      if (upperValue.length > 0 && !regNumberPattern.test(upperValue)) {
        setRegError("Must end with 5 digits (e.g. .../00736)");
      } else {
        setRegError("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const generateUserId = () => {
    const { firstName, lastName, yearOfAdmission, department, regNumber } = formData;
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toLowerCase();
    const yearSuffix = yearOfAdmission.slice(-2);
    const deptInitials = department;
    const regParts = regNumber.split('/');
    const lastFive = regParts[regParts.length - 1];
    return `${initials}${yearSuffix}${deptInitials}${lastFive}`;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.faculty ||
        !formData.department || !formData.level || !formData.regNumber || !formData.yearOfAdmission || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!regNumberPattern.test(formData.regNumber)) {
      alert("Invalid Registration Number format!");
      return;
    }

    const newUserId = generateUserId();

    const deptObj = availableDepartments.find(d => d.code === formData.department);
    const deptName = deptObj ? deptObj.name : formData.department;

    // UPDATED: Added Middle Name to confirmation
    const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;

    const confirmMessage = `Please confirm your details:\n
Name: ${fullName}
Faculty: ${formData.faculty}
Department: ${deptName}
Level: ${formData.level}
Year Of Admission: ${formData.yearOfAdmission}
Reg No: ${formData.regNumber}

Calculated User ID: ${newUserId}

Is this correct?`;

    if (window.confirm(confirmMessage)) {
      setGeneratedUserId(newUserId);
      setIsSuccess(true);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="welcome-side">
        <div className="welcome-text">
          <h1>Welcome To ExamCheck+</h1>
          <p>(Venue Explorer & Result checker)</p>
        </div>
      </div>

      <div className="form-side">
        {!isSuccess ? (
          <>
            <div className="login-header">
              <h2>Student Register</h2>
              <p>Enter your academic details</p>
            </div>

            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" placeholder="Joe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Middle Name</label>
                  <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="form-input" placeholder="(Optional)" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" placeholder="Smith" />
              </div>

              <div className="form-group">
                <label className="form-label">Faculty *</label>
                <select name="faculty" value={formData.faculty} onChange={handleFacultyChange} className="form-input" style={{ backgroundColor: 'white' }}>
                  <option value="">-- Select Faculty --</option>
                  {Object.keys(facultyData).map((facultyName) => (
                    <option key={facultyName} value={facultyName}>{facultyName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="form-input" style={{ backgroundColor: 'white' }} disabled={!formData.faculty}>
                  <option value="">{formData.faculty ? "-- Select Department --" : "-- Select Faculty First --"}</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept.code} value={dept.code}>{dept.name} ({dept.code})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>

                {/* NEW: YEAR PICKER DROPDOWN */}
                <div className="form-group">
                  <label className="form-label">Year Of Admission *</label>
                  <select
                    name="yearOfAdmission"
                    value={formData.yearOfAdmission}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ backgroundColor: 'white' }}
                  >
                    <option value="">Choose Your Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reg Number *</label>
                  <input
                    type="text"
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Auto-fills..."
                    style={regError ? { borderColor: 'red' } : {}}
                  />
                  {regError && <span style={{ color: 'red', fontSize: '0.75rem' }}>{regError}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Level *</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ backgroundColor: 'white' }}
                >
                  <option value="">-- Select Level --</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="student@gmail.com" />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'red', marginTop: '10px', textAlign: 'center' }}>
                Make sure every information is correct before registering
              </p>

              <button type="submit" className="primary-btn">Register</button>

              <button type="button" onClick={handleBackToLogin} className="secondary-btn" style={{ marginTop: '20px' }}>Back to Login Page</button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <CheckCircle size={64} color="#8b5cf6" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#1f2937' }}>Registration Successful!</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Your account has been created.</p>
            <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '8px', border: '1px dashed #8b5cf6', marginBottom: '30px' }}>
              <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Your Unique User ID:</p>
              <h3 style={{ fontSize: '1.5rem', color: '#8b5cf6', margin: '5px 0' }}>{generatedUserId}</h3>
            </div>
            <button onClick={handleBackToLogin} className="primary-btn">Proceed to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;