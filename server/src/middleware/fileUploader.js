import multer from 'multer'
export const upload = multer({
  storage: multer.memoryStorage(),
  allowed_formats: ["jpg", "png", "jpeg", "webp"]

});

export const singleUpload = upload.single("file")
export const multipleUpload = upload.array("files", 5)

export const uploadInFolder = multer({ dest: "src/uploads/" });
export const resultUpload = uploadInFolder.single("file")