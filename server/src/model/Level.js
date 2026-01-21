import { pool } from "../config/db.config.js"

export class Level {
  static async create({ name }) {
    try {
      const query = `INSERT INTO academic.levels(name) VALUES($1) ON CONFLICT (name) DO NOTHING
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
      const query = `SELECT * FROM academic.levels WHERE id=$1`
      const result = await pool.query(query, [id])
      if (result.rowCount === 0) return []
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findByName(name) {
    try {
      const query = `SELECT * FROM academic.levels WHERE name=$1`
      const result = await pool.query(query, [name])
      if (result.rowCount === 0) return []
      return result.rows
    } catch (error) {
      throw error
    }
  }
  static async findAll() {
    try {
      const query = `SELECT * FROM academic.levels`
      const result = await pool.query(query,)
      if (result.rowCount === 0) return []
      return result.rows
    } catch (error) {
      throw error
    }
  }
}