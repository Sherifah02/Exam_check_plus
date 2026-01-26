import express from 'express'
import { venueUpload } from '../middleware/fileUploader.js'
import { addVenue, checkVenue } from '../controller/venue.controller.js'
const venueRoute = express.Router()

venueRoute.post("/upload-venue", venueUpload, addVenue)
venueRoute.post("/check-venue", checkVenue)
export default venueRoute