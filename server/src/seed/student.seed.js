import { pool } from "../config/db.config.js";
export const seedStudents = async () => {
  const students = [
    {
      reg_number: "CST/21/COM/00001",
      first_name: "Aisha",
      last_name: "Abdullahi",
      email: "aisha.abdullahi@buk.edu.ng",
      department: "Computer Science",
      year_of_study: 3,
      phone_number: "08031234567",
    },
    {
      reg_number: "CST/21/COM/00750",
      first_name: "Muhammed Awwal",
      last_name: "Musa",
      email: "talk2muhammedawwal@gmail.com",
      department: "Computer Science",
      year_of_study: 4,
      phone_number: "09036144610",
    },
    {
      reg_number: "CST/21/COM/00002",
      first_name: "Muhammed",
      last_name: "Sani",
      email: "muhammed.sani@buk.edu.ng",
      department: "Computer Science",
      year_of_study: 2,
      phone_number: "08123456789",
    },
    {
      reg_number: "EEE/21/EEE/00010",
      first_name: "Fatima",
      last_name: "Yusuf",
      email: "fatima.yusuf@buk.edu.ng",
      department: "Electrical Engineering",
      year_of_study: 4,
      phone_number: "09098765432",
    },
    {
      reg_number: "EEE/21/EEE/00011",
      first_name: "Fatima",
      last_name: "Yusuf",
      email: "muhammedawwal770@gmail.com",
      department: "Electrical Engineering",
      year_of_study: 4,
      phone_number: "09098765432",
    },
  ];

  try {
    console.log("🌱 Seeding students…");

    for (const s of students) {
      const query = `
        INSERT INTO academic.students
        ( reg_number, first_name, last_name, email, department, year_of_study, phone_number)
        VALUES ( $1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (reg_number) DO NOTHING;
      `;
      await pool.query(query, [
        s.reg_number,
        s.first_name,
        s.last_name,
        s.email,
        s.department,
        s.year_of_study,
        s.phone_number,
      ]);
    }

    console.log("✅ Students seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding students:", error.message);
  }
};
