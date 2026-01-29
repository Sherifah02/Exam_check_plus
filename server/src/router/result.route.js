import express from  "express"
import { resultUpload } from "../middleware/fileUploader.js"
import { addResult, check_result_status, checkStudentResult, deleteBatch, getAllBatches, toggleResultChecking } from "../controller/result.controller.js"
import { resultCheckGuard } from "../middleware/result.js"
import { verifySession } from "../utils/session.js"

const resultRoute = express.Router()

resultRoute.post("/upload-result", verifySession, resultUpload, addResult)
resultRoute.post("/check-student-result", verifySession,resultCheckGuard, checkStudentResult)
resultRoute.post("/all-result-batch", verifySession,resultCheckGuard, getAllBatches)
resultRoute.post("/delete-result-batch/:batch_id", verifySession, deleteBatch)
resultRoute.get("/check-result-status", verifySession, check_result_status)
resultRoute.post("/toggle-result-status", verifySession, toggleResultChecking)
export default resultRoute