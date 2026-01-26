import { sendOTPEmail, sendTempPassword } from "../mail/services.js";
import { Student } from "../model/Student.js";
import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
import { generate_tempPassword, generateOTP } from "../utils/codeGenerator.js";
import { Temp_Reg } from "../model/Temp_reg.js";
import { createSession } from "../utils/session.js";
import { pool } from "../config/db.config.js";

export const checkStudentStatus = async (req, res) => {
  const { reg_number } = req.body;

  try {
    const studentResult = await Student.findByRegNum(reg_number);

    if (!studentResult.success) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials provided",
      });
    }

    const student = studentResult.student;
    const full_name = `${student.first_name} ${student.last_name}`;

    const otp = generateOTP().toString();

    const otp_hash = await bcrypt.hash(otp, 10);
    const expires_at = new Date(Date.now() + 15 * 60 * 1000);

    const existing = await Temp_Reg.findByRegNumber(reg_number);
    if (existing) {
      await Temp_Reg.deleteByRegNumber(reg_number);
    }
    await Temp_Reg.create({
      reg_number,
      otp_hash: otp_hash,
      expires_at,
    });

    await sendOTPEmail({
      full_name,
      reg_number,
      otp,
      expires_at,
      email: student.email,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("❌ Error checking student status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const verifyAndCreateUser = async (req, res) => {
  const { otp, reg_number } = req.body;

  try {
    const tempReg = await Temp_Reg.findByRegNumber(reg_number);

    if (!tempReg) {
      return res.status(404).json({
        success: false,
        message: "Registration record not found",
      });
    }

    if (new Date() > new Date(tempReg.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const isOTPValid = await bcrypt.compare(otp, tempReg.otp_hash);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials provided",
      });
    }

    const studentResult = await Student.findByRegNum(reg_number);
    const student = studentResult.student;

    const full_name = `${student.first_name} ${student.last_name}`;

    const temp_password = generate_tempPassword();
    const password_hash = await bcrypt.hash(temp_password, 10);
    const expires_at = new Date(Date.now() + 15 * 60 * 1000)
    const newAcc = new User({
      student_id: student.id,
      password_hash,
      user_type: "student",
      expires_at
    });

    await newAcc.save();
    await Temp_Reg.deleteByRegNumber(reg_number);

    await sendTempPassword({
      full_name,
      temp_password,
      reg_number,
      email: student.email,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Verify & Create User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const generateTempPassword = async (req, res) => {
  const { reg_number } = req.body;
  try {
    const user = await User.findByRegNum(reg_number);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials provided",
      });
    }
    const temp_password = await User.generateTempPassword(reg_number);
    const full_name = `${user.first_name} ${user.last_name}`
    console.table({
      full_name: full_name,
      temp_password,
      email: user.email,
    })
    const expires_at = new Date(Date.now() + 15 * 60 * 1000)
    await sendTempPassword({
      full_name: full_name,
      temp_password,
      email: user.email,
      reg_number: user.reg_number,
      expires_at,
    });
    return res.status(200).json({
      success: true,
      message: "Temporarily password sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const login = async (req, res) => {
  const { temp_password, reg_number } = req.body;

  try {
    const user = await User.findByRegNum(reg_number);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPassword = await bcrypt.compare(temp_password, user.password_hash);

    const now = Date.now();
    const expiresAt = new Date(user.expires_at).getTime();
    console.log(user)
    console.log(expiresAt)
    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect credentials provided",
      });
    }

    if (now > expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Temporary password has expired",
      });
    }


    const { password_hash, expires_at, ...safeData } = user;
    const payload = {
      full_name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email,
      user_id: user.user_id
    }
    await createSession(res, payload)
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: safeData,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAuthenticated = async (req, res) => {
  const { user_id, role } = req.user;
  console.table(req.user)
  try {
    let userData;

    if (role === "admin" || role === "super_admin") {
      // Fetch admin from auth.admin table
      const result = await pool.query(
        `SELECT id, full_name, email, role, created_at
         FROM auth.admin
         WHERE id = $1
         LIMIT 1`,
        [user_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      userData = result.rows[0];
    } else {
      // Fetch student user data
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove sensitive info
      const { password_hash, ...safeData } = user;
      userData = safeData;
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: userData,
    });
  } catch (error) {
    console.error("❌ getAuthenticated error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const SESSION_NAME = "exam_check_plus_session";

    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    res.clearCookie(SESSION_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });

  } catch (error) {
    console.error("❌ Error trying to logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.table(req.body)
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Fetch admin by email
    const query = `SELECT * FROM auth.admin WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const payload = {
      user_id: admin.id,
      email: admin.email,
      role: admin.role,
      full_name: admin.full_name,
    };

   await createSession(res, payload)

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("❌ Admin login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};
