import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { FileUploadService } from "./fileUpload.service";

// single upload
const uploadSingleFile = catchAsync(async (req, res) => {
  const result = await FileUploadService.uploadSingleFile(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "File uploaded successfully!",
    data: result,
  });
});

// multiple upload

const uploadMultipleFiles = catchAsync(async (req, res) => {
  const result = await FileUploadService.uploadMultipleFiles(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Files uploaded successfully!",
    data: result,
  });
});

export const FileUploadController = {
  uploadSingleFile,
  uploadMultipleFiles,
};
