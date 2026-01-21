import express from 'express'
import { getLevels } from '../controller/level.controller.js'

const levelRoute = express.Router()
levelRoute.get('/get-levels',getLevels)
export default levelRoute