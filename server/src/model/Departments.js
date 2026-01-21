import { pool } from "../config/db.config.js"

export class Departments {
  static async create({ name }) {
    try {
      const query = `INSERT INTO academic.departments(name) VALUES($1) ON CONFLICT (name) DO NOTHING
  RETURNING *`
      const result = await pool.query(query, [name])
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
  static async findByName(name) {
    try {
      const query = `SELECT * FROM academic.departments WHERE name = $1 LIMIT 1`
      const result = await pool.query(query, [name])
      if (result.rowCount === 0) return null

      return result
    } catch (error) {
      throw error
    }
  }
  static async findByNId(id) {
    try {
      const query = `SELECT * FROM academic.departments WHERE id = $1 LIMIT 1`
      const result = await pool.query(query, [id])
      if (result.rowCount === 0) return null

      return result
    } catch (error) {
      throw error
    }
  }
  static async findAll() {
    try {
      const query = `SELECT * FROM academic.departments `
      const result = await pool.query(query)
      if (result.rowCount === 0) return null

      return result.rows
    } catch (error) {
      throw error
    }
  }

}