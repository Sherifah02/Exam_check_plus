import { Level } from '../model/Level.js';

export const seedLevels = async () => {
  const levels = [
    { name: "100 Level" },
    { name: "200 Level" },
    { name: "300 Level" },
    { name: "400 Level" },
    { name: "500 Level" },
  ];

  try {
    for (const lvl of levels) {
      await Level.create({ name: lvl.name });
    }
    console.log("✅ Levels seeded successfully");
  } catch (error) {
    if (error.code === '23505') {
      console.log("⚠️ Some levels already exist");
    } else {
      console.error("❌ Error seeding levels:", error.message);
    }
  }
};
