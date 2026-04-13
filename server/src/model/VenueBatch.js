import { pool } from "../config/db.config.js";

export class VenueBatch {

  static async create({ course_id, hall, exam_time, session_id }) {
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
  static async getAll() {
    try {
      const query = `
        SELECT
          vb.id,
          d.name AS department,
          l.name AS level,
          s.name AS session,
          sem.name AS semester,
          c.course_code,
          c.course_title,
          vb.hall AS venue,
          NULL::integer AS capacity,
          vb.created_at,
          COUNT(sa.id)::integer AS total_students
        FROM exam.venue_batches vb
        JOIN academic.courses c ON c.id = vb.course_id
        LEFT JOIN LATERAL (
          SELECT rb.department_id, rb.level_id, rb.semester_id
          FROM academic.result_batches rb
          WHERE rb.course_id = vb.course_id
            AND rb.session_id = vb.session_id
          ORDER BY rb.uploaded_at DESC
          LIMIT 1
        ) rb ON true
        LEFT JOIN academic.departments d ON d.id = COALESCE(rb.department_id, c.department_id)
        LEFT JOIN academic.levels l ON l.id = COALESCE(rb.level_id, c.level_id)
        LEFT JOIN academic.academic_sessions s ON s.id = vb.session_id
        LEFT JOIN academic.semesters sem ON sem.id = rb.semester_id
        LEFT JOIN exam.seat_allocations sa ON sa.batch_id = vb.id
        GROUP BY
          vb.id,
          d.name,
          l.name,
          s.name,
          sem.name,
          c.course_code,
          c.course_title,
          vb.hall,
          vb.created_at
        ORDER BY vb.created_at DESC;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("❌ VenueBatch.getAll error:", error.message);
      throw error;
    }
  }

}
