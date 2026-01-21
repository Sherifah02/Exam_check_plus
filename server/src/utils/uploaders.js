import cloudinary from "../config/cloudinary.js";

export const multipleUploader = async (files = []) => {
  try {
    if (!Array.isArray(files)) {
      throw new Error("files must be an array");
    }

    if (files.length === 0) return [];

    const uploads = files.map((file) => {
      const fileSource = file.buffer
        ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
        : file.path || file;

      return cloudinary.uploader.upload(fileSource, {
        folder: "eco_uploads",
        resource_type: "auto",
      });
    });

    const results = await Promise.all(uploads);

    return results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
      resource_type: r.resource_type,
    }));
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    throw error;
  }
};
export const singleUploader = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const fileSource = file.buffer
      ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      : file.path || file;

    const result = await cloudinary.uploader.upload(fileSource, {
      folder: "eco_uploads",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary single upload error:", error);
    throw error;
  }
};
