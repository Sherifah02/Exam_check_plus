import { pool } from "../config/db.config.js"

export class Semester {
  static async create({ name }) {
    try {
      const query = `INSERT INTO academic.semesters(name) VALUES($1) ON CONFLICT (name) DO NOTHING
  RETURNING *`
      const result = await pool.query(query, [name])
      if (result.rowCount === 0) return null
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findById(id) {
    try {
      const query = `SELECT * FROM academic.semesters WHERE id=$1`
      const result = await pool.query(query, [id])
      if (result.rowCount === 0) return []
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findAll() {
    try {
      const query = `SELECT * FROM academic.semesters`
      const result = await pool.query(query,)
      if (result.rowCount === 0) return []
      return result.rows
    } catch (error) {
      throw error
    }
  }
}