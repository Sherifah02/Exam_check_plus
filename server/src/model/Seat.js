import { pool } from "../config/db.config.js";

export class Seat {

  static async allocate({ batch_id, student_id, seat_number }) {
    try {
      const query = `
        INSERT INTO exam.seat_allocations(batch_id, student_id, seat_number)
        VALUES ($1, $2, $3)
        ON CONFLICT (batch_id, seat_number) DO NOTHING
        RETURNING *;
      `;

      const result = await pool.query(query, [batch_id, student_id, seat_number]);

      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Seat.allocate error:", error.message);
      throw error;
    }
  }
}
