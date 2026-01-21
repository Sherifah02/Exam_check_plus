import express from "express"
import { fetchSessions } from "../controller/session.controller.js"

const sessionRoute = express.Router()
sessionRoute.get('/get-sessions',fetchSessions)
export default sessionRoute