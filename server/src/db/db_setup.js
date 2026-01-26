import dotenv from "dotenv";
import { pool, defaultPool } from "../config/db.config.js";

dotenv.config();
const DB_NAME = process.env.DB_NAME;

/* =====================================================
   CREATE DATABASE (RUN ONCE)
===================================================== */
export const createDatabase = async () => {
  try {
    const checkQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const result = await defaultPool.query(checkQuery, [DB_NAME]);

    if (result.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log("✅ Database created successfully");
    } else {
      console.log(`ℹ️ Database "${DB_NAME}" already exists`);
    }
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
  } finally {
    await defaultPool.end();
  }
};

/* =====================================================
   CREATE SCHEMAS AND TABLES
===================================================== */
export const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Enable UUID generation
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    /* ============================
       CREATE SCHEMAS
    ============================ */
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE SCHEMA IF NOT EXISTS academic;
      CREATE SCHEMA IF NOT EXISTS exam;
    `);

    /* ============================
       ACADEMIC REFERENCE TABLES
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.levels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.semesters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.academic_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(20) UNIQUE NOT NULL,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ============================
       STUDENTS TABLE
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reg_number VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(225) NOT NULL,
        middle_name VARCHAR(225),
        last_name VARCHAR(225),
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        department_id UUID NOT NULL REFERENCES academic.departments(id),
        level_id UUID NOT NULL REFERENCES academic.levels(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ============================
       AUTH TABLES
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth.temp_reg (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reg_number VARCHAR(50) NOT NULL,
        otp_hash VARCHAR(100) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID UNIQUE REFERENCES academic.students(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'student',
        password_hash TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ============================
       COURSES TABLE
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_code VARCHAR(20) UNIQUE NOT NULL,
        course_title VARCHAR(100) UNIQUE NOT NULL,
        department_id UUID REFERENCES academic.departments(id),
        level_id UUID REFERENCES academic.levels(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ============================
       RESULT BATCH TABLE
    ============================ */
    await client.query(`
        CREATE TABLE IF NOT EXISTS academic.result_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        uploaded_by UUID REFERENCES auth.users(id),
        department_id UUID NOT NULL REFERENCES academic.departments(id),
        level_id UUID NOT NULL REFERENCES academic.levels(id),
        semester_id UUID NOT NULL REFERENCES academic.semesters(id),
        session_id UUID NOT NULL REFERENCES academic.academic_sessions(id),
        course_id UUID NOT NULL REFERENCES academic.courses(id),
        file_path TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (department_id, level_id, semester_id, session_id, course_id)
      );

    `);

    /* ============================
       RESULTS TABLE
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        batch_id UUID NOT NULL REFERENCES academic.result_batches(id) ON DELETE CASCADE,
        reg_number TEXT NOT NULL REFERENCES academic.students(reg_number) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
        score INT NOT NULL CHECK (score >= 0 AND score <= 100),
        grade VARCHAR(2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (batch_id, reg_number, course_id)
      );
    `);

    /* ============================
       EXAM TABLES
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam.venues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID REFERENCES academic.courses(id) ON DELETE CASCADE,
        hall VARCHAR(50) NOT NULL,
        exam_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS exam.seating (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        venue_id UUID REFERENCES exam.venues(id) ON DELETE CASCADE,
        student_id UUID REFERENCES academic.students(id),
        seat_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (venue_id, seat_number)
      );
    `);

    await client.query(`
        CREATE TABLE  IF NOT EXISTS exam.venue_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES academic.academic_sessions(id),
        course_id UUID REFERENCES academic.courses(id) ON DELETE CASCADE,
        hall VARCHAR(50) NOT NULL,
        exam_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, hall, exam_time)
      );
      `)

      await client.query(`
        CREATE TABLE  IF NOT EXISTS exam.seat_allocations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      batch_id UUID NOT NULL REFERENCES exam.venue_batches(id) ON DELETE CASCADE,
      student_id UUID NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
      seat_number VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(batch_id, seat_number),
      UNIQUE(batch_id, student_id)
);
`)
    await client.query("COMMIT");
    console.log("✅ All schemas and tables created successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating tables:", error.message);
    throw error;
  } finally {
    client.release();
  }
};
