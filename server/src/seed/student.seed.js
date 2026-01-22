import { Level } from "../model/Level.js";
import { Departments } from '../model/Departments.js';
import { Student } from "../model/Student.js";

export const seedStudents = async () => {
  const students = [
    {
      reg_number: "CST/21/COM/00001",
      first_name: "Aisha",
      last_name: "Abdullahi",
      email: "aisha.abdullahi@buk.edu.ng",
      department: "Computer Science",
      level: "100 Level",
      phone_number: "08031234567",
    },
    {
      reg_number: "CST/21/COM/00750",
      first_name: "Muhammed Awwal",
      last_name: "Musa",
      email: "talk2muhammedawwal@gmail.com",
      department: "Computer Science",
      level: "400 Level",
      phone_number: "09036144610",
    },
    {
      reg_number: "CST/21/COM/00002",
      first_name: "Muhammed",
      last_name: "Sani",
      email: "muhammed.sani@buk.edu.ng",
      department: "Computer Science",
      level: "200 Level",
      phone_number: "08123456789",
    },
    {
      reg_number: "EEE/21/EEE/00010",
      first_name: "Fatima",
      last_name: "Yusuf",
      email: "fatima.yusuf@buk.edu.ng",
      department: "Electrical Engineering",
      level: "400 Level",
      phone_number: "09098765432",
    },
    {
      reg_number: "EEE/21/EEE/00011",
      first_name: "Fatima",
      last_name: "Yusuf",
      email: "muhammedawwal770@gmail.com",
      department: "Electrical Engineering",
      level: "400 Level",
      phone_number: "09098765432",
    },
    {
      reg_number: "CST/21/COM/00736",
      first_name: "Fatima",
      last_name: "Yusuf",
      email: "sherifaabdul@gmail.com",
      department: "Electrical Engineering",
      level: "400 Level",
      phone_number: "09098765432",
    },
  ];

  try {
    console.log("🌱 Seeding students…");

    for (const s of students) {
      try {
        const level = await Level.findByName(s.level);
        const department = await Departments.findByName(s.department);

        if (!level || !department) {
          console.warn(`⚠️ Level or department not found for ${s.first_name} ${s.last_name}`);
          continue;
        }

        const student = new Student({
          reg_number: s.reg_number,
          first_name: s.first_name,
          last_name: s.last_name,
          middle_name: s.middle_name || null,
          email: s.email,
          phone_number: s.phone_number,
          department_id: department.id,
          level_id: level.id,
        });

        await student.save();
      } catch (error) {
        console.error(`❌ Error inserting student ${s.reg_number}:`, error.message);
      }
    }

    console.log("✅ Students seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding students:", error.message);
  }
};
