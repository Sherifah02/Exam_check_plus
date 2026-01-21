import { Departments } from "../model/Departments.js"

export const getDepartments = async (req, res) => {
  try {
    const departments = await Departments.findAll()
    return res.status(200).json({
      success: true,
      message: "department fetched",
      departments
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