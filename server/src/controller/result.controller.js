import fs from "fs";
import { Departments } from '../model/Departments.js';
import { Semester } from "../model/Semester.js";
import { AcademicSession } from '../model/AcademicSession.js';
import { Courses } from "../model/Courses.js"
import { Level } from '../model/Level.js';
import { File } from '../utils/fileProcessor.js';
import { ResultBatch } from '../model/ResultBatch.js';
import { Result } from '../model/Result.js';

export const addResult = async (req, res) => {
  const { level, department, semester, session, courseCode } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file provided"
    });
  }
  console.log(req.file)

  try {

    const [
      department_exist,
      semester_exist,
      level_exist,
      session_exist,
      course_exist
    ] = await Promise.all([
      Departments.findByNId(department),
      Semester.findById(semester),
      Level.findById(level),
      AcademicSession.findById(session),
      Courses.findByCourseCode(courseCode),
    ]);

    const checks = [
      { value: department_exist, message: "Department not found" },
      { value: semester_exist, message: "Semester not found" },
      { value: level_exist, message: "Level not found" },
      { value: session_exist, message: "Session not found" },
      { value: course_exist, message: "Course not found" },
    ];

    const error = checks.find(check => !check.value);
    if (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }


    const result_data = await File.read(req);

    if (!result_data.length) {
      fs.unlinkSync(req.result_file.path);
      return res.status(400).json({
        success: false,
        message: "No records found in the CSV provided"
      });
    }

    //  Delete temp CSV
    fs.unlinkSync(req.file.path);
    const batches = await ResultBatch.findBySemesterCourseDepartmentLevel({
      semester_id: semester_exist.id,
      course_id: course_exist.id,
      department_id: department_exist.id,
      level_id: level_exist.id
    })
    if (batches && batches.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Result already exist"
      })
    }
    // Create ResultBatch
    const result_batch = await ResultBatch.create({
      // upload_by: req.user?.id || null, // or admin ID
      department_id: department_exist.id,
      level_id: level_exist.id,
      semester_id: semester_exist.id,
      course_id: course_exist.id,
      file_path: req.file.path,
      session_id: session_exist.id
    });
    console.log(result_batch)

    //  Insert all results
    const insertPromises = result_data.map(row => {
      return Result.create({
        batch_id: result_batch.id,
        reg_number: row.regNumber,
        course_id: course_exist.id,
        score: row.score,
        grade: row.grade
      });
    });

    await Promise.all(insertPromises);

    //  Return success response
    return res.status(201).json({
      success: true,
      message: `Results uploaded successfully for course ${course_exist.course_code}`,
      batch_id: result_batch.id,
      total_records: result_data.length
    });

  } catch (error) {
    console.error("Add result error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
export const checkStudentResult = async (req, res) => {
  const { session, reg_number, semester } = req.body

  try {
    const result_batches = await ResultBatch.findBySemesterId({
      session_id: session,
      semester_id: semester
    })

    if (!result_batches?.length || !result_batches) {
      return res.status(404).json({
        success: false,
        message: "No record found"
      })
    }

    const result_promises = result_batches.map(batch =>
      Result.findResult({
        batch_id: batch.id,
        reg_number,
        semester
      })
    )

    const result = await Promise.all(result_promises)
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "No result found for this student"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Result fetched",
      result
    })

  } catch (error) {
    console.error("Check result error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}
