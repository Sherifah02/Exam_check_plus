import { seedCourses } from "./course.seed.js";
import { seedDepartments } from "./department.seed.js";
import { seedLevels } from "./level.seed.js";
import { seedSemesters } from "./semester.seed.js";
import { seedAcademicSessions } from "./session.seed.js";
import { seedStudents } from "./student.seed.js";

const runSeeds = async () => {
  await seedStudents();
  await seedCourses();
  await seedAcademicSessions();
  await seedDepartments();
  await seedLevels();
  await seedSemesters()
};

runSeeds();
