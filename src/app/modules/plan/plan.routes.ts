// Routes: CRUD endpoints for Plan module.
import { Router } from "express";
import { PlanController } from "./plan.controller";
import validateRequest from "../../middlewares/validateRequest";
import { PlanValidation } from "./plan.validation";

const router = Router();

router.post("/", validateRequest(PlanValidation.createPlanValidationSchema), PlanController.createPlan);
router.get("/", PlanController.getAllPlan);
router.get("/:id", PlanController.getPlanById);
router.put("/:id", validateRequest(PlanValidation.updatePlanValidationSchema), PlanController.updatePlan);
router.delete("/:id", PlanController.deletePlan);

export const PlanRoutes = router;
