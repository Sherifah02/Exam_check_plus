import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const EXPIRES = "1d";
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_NAME = "exam_check_plus_session";

/* ======================
   CREATE SESSION COOKIE
====================== */
export const createSession = async (res, user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret key not provided");
  }

  const userData = {
    full_name: user.full_name,
    role: user.role,
    email: user.email,
    user_id: user.user_id,
  };

  try {
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: EXPIRES });

    res.cookie(SESSION_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  } catch (error) {
    console.error("❌ Error creating session:", error);
    throw error;
  }
};

/* ======================
   VERIFY SESSION COOKIE
====================== */
export const verifySession = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_NAME];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded contains the userData
    next();
  } catch (error) {
    console.error("❌ JWT verification error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
