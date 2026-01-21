import { pool } from "../config/db.config.js"

export class ResultBatch {
  static async create({  department_id, level_id, semester_id, session_id, course_id, file_path = '' }) {
    try {
      const query = `INSERT INTO academic.result_batches( department_id, level_id, semester_id, session_id, course_id, file_path) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`
      const result = await pool.query(query, [ department_id, level_id, semester_id, session_id, course_id, file_path])
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
    console.table({ session_id, semester_id })
    try {
      const query = `SELECT * FROM academic.result_batches WHERE session_id = $1 AND semester_id =$2 LIMIT 1`
      const result = await pool.query(query, [session_id, semester_id])
      if (result.rowCount === 0) return null
      return result.rows[0]
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
}