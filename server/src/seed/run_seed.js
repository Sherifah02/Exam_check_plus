import { seedCourses } from "./course.seed.js";
import { seedDepartments } from "./department.seed.js";
import { seedLevels } from "./level.seed.js";
import { seedSemesters } from "./semester.seed.js";
import { seedAcademicSessions } from "./session.seed.js";
import { seedStudents } from "./student.seed.js";

const runSeeds = async () => {
  await seedDepartments();
  await seedLevels();
  await seedStudents();
  await seedAcademicSessions();
  await seedSemesters()
  await seedCourses();
};

runSeeds();
