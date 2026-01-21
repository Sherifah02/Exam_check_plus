import { Departments } from '../model/Departments.js';

export const seedDepartments = async () => {
  const departments = [
    { name: "Computer Science" },
    { name: "Mathematics" },
    { name: "Physics" },
    { name: "Biology" },
    { name: "Chemistry" },
  ];

  try {
    for (const dept of departments) {
      await Departments.create({ name: dept.name });
    }
    console.log("✅ Departments seeded successfully");
  } catch (error) {
    if (error.code === '23505') {
      console.log("⚠️ Some departments already exist");
    } else {
      console.error("❌ Error seeding departments:", error.message);
    }
  }
};
