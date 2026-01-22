import { pool } from "../config/db.config.js";
import { Person } from "./Person.js";

export class Student extends Person {
  constructor(props) {
    super(props);
    this.reg_number = props.reg_number;
    this.first_name = props.first_name;
    this.middle_name = props.middle_name;
    this.last_name = props.last_name;
    this.email = props.email;
    this.phone_number = props.phone_number; 
    this.department_id = props.department_id;
    this.level_id = props.level_id;
  }

  async save(client = pool) {
    try {
      const query = `
        INSERT INTO academic.students
        (reg_number, first_name, middle_name, last_name, email, phone_number, department_id, level_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (reg_number) DO NOTHING
        RETURNING *;
      `;

      const values = [
        this.reg_number,
        this.first_name,
        this.middle_name,
        this.last_name,
        this.email,
        this.phone_number,
        this.department_id,
        this.level_id,
      ];

      const result = await client.query(query, values);

      return result.rows[0] ? new Student(result.rows[0]) : null;
    } catch (error) {
      console.error("Error saving student:", error.message);
      throw error;
    }
  }

  static async findAll(client = pool) {
    try {
      const query = `
        SELECT *
        FROM academic.students
        ORDER BY reg_number ASC;
      `;
      const result = await client.query(query);
      return result.rows.map((row) => new Student(row));
    } catch (error) {
      console.error("Error fetching all students:", error.message);
      throw error;
    }
  }

  static async findStudent({ reg_number }, client = pool) {
    try {
      const query = `
        SELECT *
        FROM academic.students
        WHERE reg_number = $1
        LIMIT 1
      `;

      const result = await client.query(query, [reg_number]);

      if (result.rowCount === 0) {
        return { success: false, message: "Invalid credentials" };
      }

      return { success: true, message: "Valid user", student: result.rows[0] };
    } catch (error) {
      console.error("Find student error:", error.message);
      throw error;
    }
  }

  static async findById(id, client = pool) {
    try {
      const result = await client.query(
        `SELECT * FROM academic.students WHERE id = $1 LIMIT 1`,
        [id]
      );

      if (result.rowCount === 0) {
        return { success: false, message: "Student not found" };
      }

      return { success: true, message: "Student data", student: result.rows[0] };
    } catch (error) {
      throw error;
    }
  }

  static async findByRegNum(reg_number, client = pool) {
    try {
      const query = `
        SELECT *
        FROM academic.students
        WHERE reg_number = $1
        LIMIT 1;
      `;

      const result = await client.query(query, [reg_number]);

      if (result.rowCount === 0) {
        return { success: false, message: "Student not found" };
      }

      return { success: true, message: "Student found", student: result.rows[0] };
    } catch (error) {
      console.error("Error finding student by reg number:", error.message);
      throw error;
    }
  }
}
