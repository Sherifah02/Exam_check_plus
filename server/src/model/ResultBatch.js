import { pool } from "../config/db.config.js"

export class ResultBatch {
  static async create({ department_id, level_id, semester_id, session_id, course_id, file_path = '' }) {
    try {
      const query = `INSERT INTO academic.result_batches( department_id, level_id, semester_id, session_id, course_id, file_path) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`
      const result = await pool.query(query, [department_id, level_id, semester_id, session_id, course_id, file_path])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findBySessionId(session_id) {
    try {
      const query = `SELECT * FROM academic.result_batches WHERE session_id = $1 LIMIT 1`
      const result = await pool.query(query, [session_id])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findBySemesterId({ session_id, semester_id }) {

    try {
      const query = `SELECT * FROM academic.result_batches WHERE session_id = $1 AND semester_id =$2 `
      const result = await pool.query(query, [session_id, semester_id])
      if (result.rowCount === 0) return null
      return result.rows
    } catch (error) {

      throw error
    }
  }
  static async findBySessionIdAndSemester({ session_id, semester_id }) {
    try {
      const query = `SELECT * FROM academic.result_batches WHERE session_id = $1 AND semester_id = $2 LIMIT 1`
      const result = await pool.query(query, [session_id, semester_id])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  static async findBySemesterCourseDepartmentLevel({
    semester_id,
    course_id,
    department_id,
    level_id
  }) {
    try {
      const query = `
      SELECT *
      FROM academic.result_batches
      WHERE semester_id = $1
        AND course_id = $2
        AND department_id = $3
        AND level_id = $4
    `

      const result = await pool.query(query, [
        semester_id,
        course_id,
        department_id,
        level_id
      ])

      if (result.rowCount === 0) return null
      return result.rows
    } catch (error) {
      throw error
    }
  }
  static async deleteById(batch_id) {
  try {
    const query = `
      DELETE FROM academic.result_batches
      WHERE id = $1
      RETURNING *;
    `
    const result = await pool.query(query, [batch_id])

    if (result.rowCount === 0) return null
    return result.rows[0]
  } catch (error) {
    throw error
  }
}
static async findAllDetailed() {
  try {
    const query = `
      SELECT
        rb.id,
        rb.uploaded_at AS created_at,
        d.name AS department,
        l.name AS level,
        s.name AS session,
        sem.name AS semester,
        c.course_code,
        c.course_title
      FROM academic.result_batches rb
      JOIN academic.departments d ON d.id = rb.department_id
      JOIN academic.levels l ON l.id = rb.level_id
      JOIN academic.academic_sessions s ON s.id = rb.session_id
      JOIN academic.semesters sem ON sem.id = rb.semester_id
      JOIN academic.courses c ON c.id = rb.course_id
      ORDER BY rb.uploaded_at DESC
    `
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    throw error
  }
}


}