import { Request } from "express";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import config from "../../config";

// upload single file
const uploadSingleFile = async (req: Request) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file Uploaded");
  }

  const file = req.file;
  const fileUrl = `${config.url.file}/${file.filename}`;

  return { fileUrl };
};

// upload multiple files

const uploadMultipleFiles = async (req: Request) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError(400, "No files provided");
  }

  const files = req.files as Express.Multer.File[];
  const fileUrls = files.map((file) => {
    return `${config.url.file}/${file.filename}`;
  });

  return { fileUrls };
};

export const FileUploadService = {
  uploadSingleFile,
  uploadMultipleFiles,
};
