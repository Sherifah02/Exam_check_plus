import express from "express"
import { getSemesters } from "../controller/semester.controller.js"
const semesterRoute = express.Router()
semesterRoute.get("/get-semester", getSemesters)
export default semesterRoute