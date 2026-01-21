import { pool } from "../config/db.config.js"

export class AcademicSession {
  static async create({ name, start_date, end_date }) {
    try {
      const query = `
  INSERT INTO academic.academic_sessions(name, start_date, end_date)
  VALUES($1, $2, $3)
  ON CONFLICT (name) DO NOTHING
  RETURNING *;
`;

      const result = await pool.query(query, [name, start_date, end_date])
      if (result.rowCount === 0) {
        return null
      }
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findById(id) {
    try {
      const query = `SELECT * FROM academic.academic_sessions WHERE id = $1 LIMIT 1`
      const result = await pool.query(query, [id])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findAll() {
    try {
      const query = `SELECT * FROM academic.academic_sessions `
      const result = await pool.query(query)
      if (result.rowCount === 0) return null
      return result.rows
    } catch (error) {
      throw error
    }
  }
}