import fs from "fs";
import csv from "csv-parser";

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
}
