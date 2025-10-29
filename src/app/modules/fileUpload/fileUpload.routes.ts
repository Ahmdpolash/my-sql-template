import { Router } from "express";
import { uploadFile } from "../../helpers/uploadFile";
import { FileUploadController } from "./fileUpload.controlle";

const router = Router();

// upload single
router.post(
  "/upload",
  uploadFile.single("file"),
  FileUploadController.uploadSingleFile
);

// Upload multiple files
router.post(
  "/upload-multiple",
  uploadFile.array("file", 20),
  FileUploadController.uploadMultipleFiles
);

export const FileUploadRoutes = router;
