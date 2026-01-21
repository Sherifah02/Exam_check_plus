import { Level } from "../model/Level.js"

export const getLevels = async (req, res) => {
  try {
    const levels = await Level.findAll()
    return res.status(200).json({
      success: true,
      message: "Level fetched",
      levels
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