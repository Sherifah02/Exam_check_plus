import { Courses } from '../model/Courses.js';
import { Departments } from '../model/Departments.js';
import { Level } from '../model/Level.js';

export const seedCourses = async () => {
  try {
    // Fetch IDs first
    const csDept = await Departments.findByName("Computer Science");
    const mathDept = await Departments.findByName("Mathematics");

    const lvl100 = await Level.findByName("100 Level");
    const lvl200 = await Level.findByName("200 Level");

    const courses = [
      {
        course_code: "CST101",
        course_title: "Introduction to Computer Science",
        department_id: csDept.id,
        level_id: lvl100.id,
      },
      {
        course_code: "MTH101",
        course_title: "Calculus I",
        department_id: mathDept.id,
        level_id: lvl100.id,
      },
      {
        course_code: "CST201",
        course_title: "Data Structures",
        department_id: csDept.id,
        level_id: lvl200.id,
      },
    ];

    for (const course of courses) {
      await Courses.create(course);
    }

    console.log("✅ Courses seeded successfully");

  } catch (error) {
    if (error.code === '23505') {
      console.log("⚠️ Some courses already exist");
    } else {
      console.error("❌ Error seeding courses:", error.message);
    }
  }
};
