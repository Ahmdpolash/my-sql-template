// Controller: Handles HTTP requests for the Plan module.
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PlanService } from "./plan.service";

// Create
const createPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.createPlanInDB(req.body);
  sendResponse(res, { statusCode: 201, message: "Plan created", data: result });
});

// Get All
const getAllPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.getAllPlans();
  sendResponse(res, { statusCode: 200, message: "Fetched all Plans", data: result });
});

// Get by ID
const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.getPlanById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Fetched Plan", data: result });
});

// Update
const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.updatePlan(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "Plan updated", data: result });
});

// Delete
const deletePlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.deletePlan(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Plan deleted", data: result });
});

export const PlanController = {
  createPlan,
  getAllPlan,
  getPlanById,
  updatePlan,
  deletePlan,
};
