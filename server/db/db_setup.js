import dotenv from "dotenv";
import { pool, defaultPool } from "../src/config/db.config.js";

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
   CREATE SCHEMAS & TABLES
===================================================== */
export const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Enable UUID generation
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    /* ============================
       SCHEMAS
    ============================ */
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS auth_schema;
      CREATE SCHEMA IF NOT EXISTS report_schema;
      CREATE SCHEMA IF NOT EXISTS location_schema;
      CREATE SCHEMA IF NOT EXISTS stakeholder_schema;
      CREATE SCHEMA IF NOT EXISTS notification_schema;
      CREATE SCHEMA IF NOT EXISTS analytics_schema;
      CREATE SCHEMA IF NOT EXISTS system_schema;
    `);

    /* ============================
       AUTH SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_schema.roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS auth_schema.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone_number VARCHAR(20),
        role_id UUID REFERENCES auth_schema.roles(id),
        is_active BOOLEAN DEFAULT TRUE,
        is_super_admin BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP,
        otp_code TEXT,
        otp_expiry TIMESTAMP,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS auth_schema.permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS auth_schema.role_permissions (
        role_id UUID REFERENCES auth_schema.roles(id) ON DELETE CASCADE,
        permission_id UUID REFERENCES auth_schema.permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );
    `);

    /* ============================
       REPORT SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_schema.issue_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS report_schema.reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth_schema.users(id) ON DELETE CASCADE,
        issue_type_id UUID REFERENCES report_schema.issue_types(id),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        location_address TEXT,
        severity_level VARCHAR(20) CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
        status VARCHAR(30) DEFAULT 'pending'
          CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
        assigned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS report_schema.report_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS report_schema.report_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth_schema.users(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        is_edited BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS report_schema.report_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth_schema.users(id) ON DELETE CASCADE,
        vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (report_id, user_id)
      );

      CREATE TABLE report_schema.report_organizations (
        id SERIAL PRIMARY KEY,
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        organization_id UUID REFERENCES stakeholder_schema.organizations(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (report_id, organization_id)
      );
    `);


    // Vote summary view
    await client.query(`
      CREATE OR REPLACE VIEW report_schema.report_vote_summary AS
      SELECT
        report_id,
        SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END) AS upvotes,
        SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END) AS downvotes,
        COUNT(*) AS total_votes
      FROM report_schema.report_votes
      GROUP BY report_id;
    `);

    /* ============================
       LOCATION SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS location_schema.states (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        state_name VARCHAR(100) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS location_schema.local_governments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        state_id UUID REFERENCES location_schema.states(id) ON DELETE CASCADE,
        lga_name VARCHAR(100) NOT NULL,
        UNIQUE (state_id, lga_name)
      );

      CREATE TABLE IF NOT EXISTS location_schema.report_locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        state_id UUID REFERENCES location_schema.states(id),
        lga_id UUID REFERENCES location_schema.local_governments(id)
      );
    `);

    /* ============================
       STAKEHOLDER SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS stakeholder_schema.organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        organization_type VARCHAR(50),
        email VARCHAR(150),
        phone_number VARCHAR(20),
        description TEXT,
        location TEXT,
        website TEXT
      );

      CREATE TABLE IF NOT EXISTS stakeholder_schema.organization_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth_schema.users(id) ON DELETE CASCADE,
        organization_id UUID REFERENCES stakeholder_schema.organizations(id) ON DELETE CASCADE,
        UNIQUE (user_id, organization_id)
      );

      CREATE UNIQUE INDEX unique_organization_name
      ON stakeholder_schema.organizations (LOWER(name));

    `);

    /* ============================
       NOTIFICATION SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_schema.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES report_schema.reports(id) ON DELETE CASCADE,
        recipient_user_id UUID REFERENCES auth_schema.users(id),
        notification_type VARCHAR(30),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP DEFAULT NOW()
      );
    `);

    /* ============================
       ANALYTICS SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_schema.user_activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth_schema.users(id),
        action TEXT,
        ip_address VARCHAR(45),
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

    /* ============================
       SYSTEM SCHEMA
    ============================ */
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_schema.audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth_schema.users(id),
        action TEXT,
        affected_table TEXT,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

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
