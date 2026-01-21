import { pool } from "../config/db.config.js";
import { Person } from "./Person.js";

export class Student extends Person {
  constructor(props) {
    super(props);
  }

  async save(client = pool) {
    try {
      const query = `
      INSERT INTO academic.students
      (reg_number, first_name, middle_name, last_name, email, department, year_of_study)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (reg_number) DO NOTHING
  RETURNING *;
    `;

      const values = [
        this.reg_number,
        this.first_name,
        this.middle_name,
        this.last_name,
        this.email,
        this.department,
        this.year_of_study,
      ];

      const result = await client.query(query, values);
      return new Student(result.rows[0]);
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
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      return {
        success: true,
        message: "Valid user",
        student: result.rows[0],
      };
    } catch (error) {
      console.error("Find student error:", error.message);
      throw error;
    }
  }
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT * FROM academic.students WHERE id = $1 LIMIT 1`,
        [id],
      );

      if (result.rowCount === 0) {
        return {
          success: false,
          message: "Student not found",
        };
      }

      return {
        success: true,
        message: "Student data",
        student: result.rows[0],
      };
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
        return {
          success: false,
          message: "Student not found",
        };
      }

      return {
        success: true,
        message: "Student found",
        student: result.rows[0],
      };
    } catch (error) {
      console.error("Error finding student by reg number:", error.message);
      throw error;
    }
  }
}
