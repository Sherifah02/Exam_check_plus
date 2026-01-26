import { pool } from "../config/db.config.js";
import { AcademicSession } from "../model/AcademicSession.js";
import { Courses } from "../model/Courses.js";
import { Level } from "../model/Level.js";
import { VenueBatch } from "../model/VenueBatch.js";
import { Seat } from "../model/Seat.js";
import { File } from "../utils/fileProcessor.js";
import { Student } from "../model/Student.js";
import fs from "fs"
export const addVenue = async (req, res) => {
  const { level, course_code, session } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Validate level, session, course
    const [level_exist, session_exist, course_exist] = await Promise.all([
      Level.findById(level),
      AcademicSession.findById(session),
      Courses.findByCourseCode(course_code),
    ]);

    const checks = [
      { value: level_exist, message: "Level not found" },
      { value: session_exist, message: "Session not found" },
      { value: course_exist, message: "Course not found" },
    ];

    const error = checks.find((c) => !c.value);
    if (error) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Read CSV
    const venue_data = await File.readVenue(req);
    if (!venue_data.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "No records found in the CSV provided",
      });
    }

    // Create or reuse venue batch using first row
    const firstRow = venue_data[0];
    const venue_batch = await VenueBatch.create({
      session_id:session_exist.id,
      course_id: course_exist.id,
      hall: firstRow.hall,
      exam_time: firstRow.exam_time,
    });

    if (!venue_batch) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Failed to create venue batch",
      });
    }

    // Allocate seats for all students
    for (const value of venue_data) {
      const student = await Student.findByRegNum(value.regNumber);
      if (!student.student) {
        console.warn(`Student not found: ${value.regNumber}`);
        continue;
      }

      await Seat.allocate({
        batch_id: venue_batch.id,
        student_id: student.student.id,
        seat_number: value.seat_number,
      });
    }

    await client.query("COMMIT");
    res.json({
      success: true,
      message: "Venue CSV uploaded and seats allocated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ addVenue error:", error.message);
    res.status(500).json({ success: false, message: "Upload failed" });
  } finally {
    client.release();
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const checkVenue = async (req, res) => {
  const { reg_number, session } = req.body;
  console.table(req.body)
  if (!reg_number || !session) {
    return res.status(400).json({
      success: false,
      message: "Registration number and session are required",
    });
  }

  try {
    const query = `
      SELECT
        s.reg_number AS reg_number,
        c.course_code,
        vb.hall,
        vb.exam_time,
        sa.seat_number
      FROM academic.students s
      JOIN exam.seat_allocations sa ON sa.student_id = s.id
      JOIN exam.venue_batches vb ON vb.id = sa.batch_id
      JOIN academic.courses c ON c.id = vb.course_id
      WHERE s.reg_number = $1 AND vb.session_id = $2
      ORDER BY vb.exam_time ASC
    `;

    const result = await pool.query(query, [reg_number, session]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No venue/seat found for this student in this session",
      });
    }

    res.json({
      success: true,
      venues: result.rows,
    });
  } catch (error) {
    console.error("❌ checkVenue error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch venue" });
  }
};
