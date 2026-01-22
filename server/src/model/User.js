import bcrypt from "bcryptjs";
import { pool } from "../config/db.config.js";
import { generate_tempPassword } from "../utils/codeGenerator.js";
import { Person } from "./Person.js";
import crypto from "crypto";

export class User extends Person {
  constructor(props) {
    super(props);
    this.student_id = props.student_id;
    this.id = props.id;
    this.password_hash = props.password_hash;
    this.role = props.role || "student";
    this.expires_at = props.expires_at;
  }

  async save(client = pool) {
    try {
      const query = `
        INSERT INTO auth.users(student_id, password_hash, role, expires_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [this.student_id, this.password_hash, this.role, this.expires_at];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async find(option = {}, client = pool) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(option)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      if (!fields.length) throw new Error("No fields provided for search");

      const query = `SELECT * FROM auth.users WHERE ${fields.join(" AND ")} LIMIT 1`;
      const result = await client.query(query, values);

      if (result.rowCount === 0) return { success: false, message: "User not found" };

      return { success: true, user: result.rows[0] };
    } catch (error) {
      console.error("Error in User.find:", error.message);
      throw error;
    }
  }

  static async findById(id, client = pool) {
    try {
      const query = `
        SELECT
          u.id AS user_id,
          u.password_hash,
          u.role,
          u.expires_at,
          u.created_at AS user_created_at,
          s.id AS student_id,
          s.reg_number,
          s.first_name,
          s.last_name,
          s.email,
          s.phone_number,
          s.department_id,
          s.level_id,
          d.name AS department,
          l.name AS level
        FROM auth.users u
        INNER JOIN academic.students s ON u.student_id = s.id
        LEFT JOIN academic.departments d ON d.id = s.department_id
        LEFT JOIN academic.levels l ON l.id = s.level_id
        WHERE u.id = $1
        LIMIT 1;
      `;
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error.message);
      throw error;
    }
  }

  static async findByRegNum(reg_number, client = pool) {
    try {
      const query = `
        SELECT
          u.id AS user_id,
          u.password_hash,
          u.role,
          u.expires_at,
          u.created_at AS user_created_at,
          s.id AS student_id,
          s.reg_number,
          s.first_name,
          s.last_name,
          s.email,
          s.phone_number,
          s.department_id,
          s.level_id
        FROM auth.users u
        INNER JOIN academic.students s ON u.student_id = s.id
        WHERE s.reg_number = $1
        LIMIT 1;
      `;
      const result = await client.query(query, [reg_number]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by reg number:", error.message);
      throw error;
    }
  }

  static async findAll(client = pool) {
    try {
      const result = await client.query(`SELECT * FROM auth.users ORDER BY id ASC`);
      return result.rows;
    } catch (error) {
      console.error("Error fetching all users:", error.message);
      throw error;
    }
  }

  async delete(id, client = pool) {
    try {
      const query = `DELETE FROM auth.users WHERE id = $1 RETURNING *`;
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw error;
    }
  }

  static async update(id, option = {}, client = pool) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(option)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      if (!fields.length) throw new Error("No fields provided for update");
      if (!id) throw new Error("No user id provided");

      values.push(id);
      const query = `
        UPDATE auth.users
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING *;
      `;
      const result = await client.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async generateTempPassword(reg_number, client = pool) {
    try {
      const user = await this.findByRegNum(reg_number, client);
      if (!user) return null;

      const temp_password = generate_tempPassword().toString();
      const password_hash = await bcrypt.hash(temp_password, 10);
      const expires_at = new Date(Date.now() + 15 * 60 * 1000);

      await client.query(
        `UPDATE auth.users
         SET password_hash = $1, expires_at = $2
         WHERE id = $3`,
        [password_hash, expires_at, user.user_id]
      );

      return temp_password;
    } catch (error) {
      console.error("Error generating temp password:", error.message);
      throw error;
    }
  }

  static async totalStudent(client = pool) {
    try {
      const result = await client.query(`SELECT COUNT(*) FROM auth.users`);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw error;
    }
  }
}
