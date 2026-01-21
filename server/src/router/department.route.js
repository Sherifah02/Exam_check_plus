import express from 'express'
import { getDepartments } from '../controller/department.controller.js'
const departmentRoute = express.Router()
departmentRoute.get("/get-departments", getDepartments)
export default departmentRoute