import { pool } from "../config/db.config.js";

export class VenueBatch {

  static async create({ course_id, hall, exam_time,session_id }) {
    try {
      // Check if batch exists
      const existing = await pool.query(
        `SELECT * FROM exam.venue_batches
         WHERE course_id = $1 AND hall = $2 AND exam_time = $3 AND session_id = $4
         LIMIT 1`,
        [course_id, hall, exam_time, session_id]
      );

      if (existing.rows.length) {
        return existing.rows[0]; // return existing batch
      }

      // Insert new batch
      const query = `
        INSERT INTO exam.venue_batches(course_id, hall, exam_time, session_id)
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await pool.query(query, [course_id, hall, exam_time, session_id]);

      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ VenueBatch.create error:", error.message);
      throw error;
    }
  }
}
