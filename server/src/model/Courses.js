import { pool } from "../config/db.config.js"

export class Courses {
  static async create({ course_code, course_title, department_id, level_id }) {
    try {
      const query = `INSERT INTO academic.courses(course_code,course_title,department_id,level_id) VALUES($1, $2,$3,$4)ON CONFLICT (course_code) DO NOTHING
  RETURNING *`
      const result = await pool.query(query, [course_code, course_title, department_id, level_id])
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findByCourseCode(course_code) {
    try {
      const query = `SELECT * FROM academic.courses WHERE course_code = $1 LIMIT 1`
      const result = await pool.query(query, [course_code])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findAll() {
    try {
      const query = `SELECT * FROM academic.courses`
      const result = await pool.query(query, [course_code])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async deleteByCourseCode(course_code) {
    try {
      const query = `DELETE * FROM academic.courses WHERE course_code = $1 LIMIT 1`
      const result = await pool.query(query, [course_code])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
}