import { Semester } from "../model/Semester.js"

export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.findAll()
    return res.status(200).json({
      success: true,
      message: "semester fetched",
      semesters
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