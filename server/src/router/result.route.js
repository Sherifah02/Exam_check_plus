import express from  "express"
import { resultUpload } from "../middleware/fileUploader.js"
import { addResult, checkStudentResult } from "../controller/result.controller.js"

const resultRoute = express.Router()

resultRoute.post("/upload-result", resultUpload, addResult)
resultRoute.get("/check-student-result", checkStudentResult)

export default resultRoute