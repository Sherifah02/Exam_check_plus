import { AcademicSession } from '../model/AcademicSession.js';

export const seedAcademicSessions = async () => {
  const sessions = [
    { name: "2023/2024", start_date: "2023-09-01", end_date: "2024-07-31" },
    { name: "2024/2025", start_date: "2024-09-01", end_date: "2025-07-31" },
  ];

  try {
    for (const session of sessions) {
      await AcademicSession.create(session);
    }
    console.log("✅ Academic sessions seeded successfully");
  } catch (error) {
    if (error.code === '23505') {
      console.log("⚠️ Some sessions already exist");
    } else {
      console.error("❌ Error seeding sessions:", error.message);
    }
  }
};
