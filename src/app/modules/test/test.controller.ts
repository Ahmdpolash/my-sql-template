// Controller: Handles HTTP requests for the Test module.
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TestService } from "./test.service";

// Create
const createTest = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.createTestInDB(req.body);
  sendResponse(res, { statusCode: 201, message: "Test created", data: result });
});

// Get All
const getAllTest = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.getAllTests();
  sendResponse(res, { statusCode: 200, message: "Fetched all Tests", data: result });
});

// Get by ID
const getTestById = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.getTestById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Fetched Test", data: result });
});

// Update
const updateTest = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.updateTest(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Test updated", data: result });
});

// Delete
const deleteTest = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.deleteTest(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Test deleted", data: result });
});

export const TestController = {
  createTest,
  getAllTest,
  getTestById,
  updateTest,
  deleteTest,
};
