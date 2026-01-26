import bcrypt from 'bcryptjs'
import { pool } from "../config/db.config.js";

export const seedAdmins = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const admins = [
      {
        full_name: "Super Admin",
        email: "superadmin@examplus.com",
        role: "admin",
        password: "admin123",
      },
      {
        full_name: "Exam Officer",
        email: "examofficer@examplus.com",
        role: "admin",
        password: "exam123",
      },
      {
        full_name: "ICT Admin",
        email: "ictadmin@examplus.com",
        role: "admin",
        password: "ict123",
      },
    ];

    for (const admin of admins) {
      // prevent duplicate seed
      const existsQuery = `
        SELECT id FROM auth.admin WHERE email = $1 LIMIT 1
      `;
      const exists = await client.query(existsQuery, [admin.email]);

      if (exists.rowCount > 0) {
        console.log(`⚠️ ${admin.email} already exists. Skipping.`);
        continue;
      }

      const password_hash = await bcrypt.hash(admin.password, 10);

      const insertQuery = `
        INSERT INTO auth.admin (full_name, email, role, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;

      await client.query(insertQuery, [
        admin.full_name,
        admin.email,
        admin.role,
        password_hash,
      ]);

      console.log(`✅ Seeded admin: ${admin.email}`);
    }

    await client.query("COMMIT");
    console.log("✅ Admin seeding completed");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Admin seed failed:", error.message);
  } finally {
    client.release();
  }
};
