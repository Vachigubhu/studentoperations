import multer from "multer";
import { uploadConfig } from "../config/upload.js";

export const uploadDocument = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: uploadConfig.maxFileSize,
  },

  fileFilter: (_req, file, callback) => {
    if (!uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new Error(
          "Invalid file type. Only PDF, JPEG, and PNG files are allowed.",
        ),
      );
      return;
    }
    callback(null, true);
  },
});
