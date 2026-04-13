import express from 'express'
import { venueUpload } from '../middleware/fileUploader.js'
import { addVenue, checkVenue, getVenueBatches } from '../controller/venue.controller.js'
const venueRoute = express.Router()

venueRoute.post("/upload-venue", venueUpload, addVenue)
venueRoute.post("/check-venue", checkVenue)
venueRoute.get("/all-venue-batch", getVenueBatches)
export default venueRoute