import fs from "node:fs/promises";
import path from "node:path";
import "multer";

const uploadDirectory = path.resolve("uploads");

export const ensureUploadDirectory = async () => {
  await fs.mkdir(uploadDirectory, {
    recursive: true,
  });
};

export const saveFile = async (
  file: Express.Multer.File,
  storageKey: string,
) => {
  await ensureUploadDirectory();

  const filePath = path.join(uploadDirectory, storageKey);

  await fs.writeFile(filePath, file.buffer);

  return filePath;
};

export const deleteFile = async (storageKey: string) => {
  const filePath = path.join(uploadDirectory, storageKey);

  try {
    await fs.unlink(filePath);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return;
    }
    throw error;
  }
};
