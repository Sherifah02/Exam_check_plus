import { AcademicSession } from "../model/AcademicSession.js"

export const fetchSessions = async (req, res) => {
  try {
    const sessions = await AcademicSession.findAll()
    return res.status(200).json({
      success: true,
      message: "Sessions fetched",
      sessions
    })
  } catch (error) {
    console.error("Add result error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}