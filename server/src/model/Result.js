import { pool } from "../config/db.config.js"

export class Result {
  static async create({ batch_id, reg_number, course_id, score, grade }) {
    try {
      const query = `INSERT INTO academic.results(batch_id, reg_number, course_id, score, grade) VALUES($1,$2,$3,$4,$5) RETURNING *`
      const result = await pool.query(query, [batch_id, reg_number, course_id, score, grade])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findResult({ batch_id, reg_number,semester }) {
    try {
      const query = `SELECT r.batch_id,
        r.score,
        r.grade,
        r.reg_number,
        c.course_title,
        c.course_code
      FROM academic.results r
      LEFT JOIN academic.courses c ON r.course_id = c.id
      WHERE r.batch_id = $1 AND r.reg_number =$2 
      `
      const result = await pool.query(query, [batch_id, reg_number])
      if (result.rowCount === 0) return null
      return result.rows
    } catch (error) {
      throw error
    }
  }
}