import fs from "fs";
import csv from "csv-parser";
import { error } from "console";

export class File {
  static read(req) {
    return new Promise((resolve, reject) => {
      const extracted = [];
      let headersChecked = false;

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          // Validate structure once
          if (!headersChecked) {
            if (
              !row.RegNumber ||
              !row.Score ||
              !row.Grade
            ) {
              return reject(new Error("Invalid CSV format"));
            }
            headersChecked = true;
          }

          extracted.push({
            regNumber: row.RegNumber.trim(),
            score: Number(row.Score),
            grade: row.Grade.trim(),
          });
        })
        .on("end", () => {
          resolve(extracted);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
static readVenue(req) {
    return new Promise((resolve, reject) => {
      const extracted = [];
      let headersChecked = false;

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
         
          const reg_number = row.reg_number?.trim();
          const course_code = row.course_code?.trim();
          const hall = row.hall?.trim();
          const exam_time = row.exam_time?.trim();
          const seat_number = row.seat_number?.trim();

          if (!headersChecked) {
            if (!reg_number || !course_code || !hall || !exam_time || !seat_number) {
              return reject(new Error("Invalid CSV format or missing headers"));
            }
            headersChecked = true;
          }

          extracted.push({ regNumber: reg_number, course_code, hall, exam_time, seat_number });
        })
        .on("end", () => {
          resolve(extracted);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}
