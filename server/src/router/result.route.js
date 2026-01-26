import express from  "express"
import { resultUpload } from "../middleware/fileUploader.js"
import { addResult, checkStudentResult, deleteBatch, getAllBatches } from "../controller/result.controller.js"

const resultRoute = express.Router()

resultRoute.post("/upload-result", resultUpload, addResult)
resultRoute.post("/check-student-result", checkStudentResult)
resultRoute.post("/all-result-batch", getAllBatches)
resultRoute.post("/delete-result-batch/:batch_id", deleteBatch)

export default resultRoute