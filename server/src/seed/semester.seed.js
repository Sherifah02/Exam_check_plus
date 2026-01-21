import { Semester } from '../model/Semester.js';

export const seedSemesters = async () => {
  const semesters = [
    { name: "First Semester" },
    { name: "Second Semester" },
  ];

  try {
    for (const sem of semesters) {
      await Semester.create({ name: sem.name });
    }
    console.log("✅ Semesters seeded successfully");
  } catch (error) {
    if (error.code === '23505') {
      console.log("⚠️ Some semesters already exist");
    } else {
      console.error("❌ Error seeding semesters:", error.message);
    }
  }
};
