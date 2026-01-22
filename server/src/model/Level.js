import { pool } from "../config/db.config.js";

export class Level {
  static async create({ name }) {
    try {
      const query = `
        INSERT INTO academic.levels(name)
        VALUES($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `;
      const result = await pool.query(query, [name]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT *
        FROM academic.levels
        WHERE id = $1
        LIMIT 1;
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const query = `
        SELECT *
        FROM academic.levels
        WHERE name = $1;
      `;
      const result = await pool.query(query, [name]);
      return result.rows.length ? result.rows : [];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = `SELECT * FROM academic.levels ORDER BY name ASC;`;
      const result = await pool.query(query);
      return result.rows.length ? result.rows : [];
    } catch (error) {
      throw error;
    }
  }
}