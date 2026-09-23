import multer from "multer";
import { uploadConfig } from "../config/upload.js";
import { AppError } from "../utils/AppError.js";

export const uploadDocument = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: uploadConfig.maxFileSize,
  },

  fileFilter: (_req, file, callback) => {
    if (!uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new AppError(
          400,
          "Invalid file type. Only PDF, JPEG, and PNG files are allowed.",
        ),
      );
      return;
    }

    callback(null, true);
  },
});
