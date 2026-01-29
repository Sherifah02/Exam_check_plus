import { pool } from "../config/db.config.js";

export const resultCheckGuard = async (req, res, next) => {
  try {
    const { role } = req.user;

    // ✅ Admins are always allowed
    if (role === "admin" || role === "super_admin") {
      return next();
    }

    // 🔍 Check global result status
    const result = await pool.query(
      `SELECT status FROM exam.result_checking WHERE id = 1 LIMIT 1`
    );

    if (result.rowCount === 0 || result.rows[0].status === false) {
      return res.status(403).json({
        success: false,
        message: "Result checking is currently closed",
      });
    }

    // ✅ Allowed
    next();
  } catch (error) {
    console.error("❌ resultCheckGuard error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to verify result access",
    });
  }
};
