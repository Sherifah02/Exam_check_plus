import { pool } from "../config/db.config.js";

export const seedResultChecking = async () => {
  try {
    const query = `
      INSERT INTO exam.result_checking (id, status)
      VALUES (1, false)
      ON CONFLICT (id) DO NOTHING
    `;

    await pool.query(query);
    console.log("✅ Result checking seed completed");
  } catch (error) {
    console.error("❌ Failed to seed result checking:", error.message);
    throw error;
  }
};
