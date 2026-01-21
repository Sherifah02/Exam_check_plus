import { pool } from "../config/db.config.js";

export class Temp_Reg {
  static async  create({ reg_number, otp_hash, expires_at }) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO auth.temp_reg (reg_number, otp_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [reg_number, otp_hash, expires_at];

      const result = await client.query(query, values);
      return result.rows[0]; // returns the inserted row
    } catch (error) {
      console.error("❌ Error creating temp_reg:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
  static async findByRegNumber(reg_number) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM auth.temp_reg
        WHERE reg_number = $1
        ORDER BY created_at DESC
        LIMIT 1;
      `;
      const result = await client.query(query, [reg_number]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error fetching temp_reg:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteExpired() {
    const client = await pool.connect();
    try {
      const query = `DELETE FROM auth.temp_reg WHERE expires_at < NOW();`;
      const result = await client.query(query);
      return result.rowCount; // number of deleted rows
    } catch (error) {
      console.error(
        "❌ Error deleting expired temp_reg entries:",
        error.message,
      );
      throw error;
    } finally {
      client.release();
    }
  }
  static async deleteByRegNumber(reg_number){

  }
}
