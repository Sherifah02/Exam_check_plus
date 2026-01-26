import multer from 'multer'
export const upload = multer({
  storage: multer.memoryStorage(),
  allowed_formats: ["jpg", "png", "jpeg", "webp"]

});

export const singleUpload = upload.single("file")
export const multipleUpload = upload.array("files", 5)

export const uploadInFolder = multer({
   dest: "src/uploads/", fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      cb(new Error("Only CSV files allowed"), false);
    }
    cb(null, true);
  }, });
export const resultUpload = uploadInFolder.single("result_file")
export const venueUpload = uploadInFolder.single("venue_file")