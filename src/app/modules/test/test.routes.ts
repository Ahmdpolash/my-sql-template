// Routes: CRUD endpoints for Test module.
import { Router } from "express";
import { TestController } from "./test.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TestValidation } from "./test.validation";

const router = Router();

router.post("/", validateRequest(TestValidation.createTestValidationSchema), TestController.createTest);
router.get("/", TestController.getAllTest);
router.get("/:id", TestController.getTestById);
router.put("/:id", validateRequest(TestValidation.updateTestValidationSchema), TestController.updateTest);
router.delete("/:id", TestController.deleteTest);

export const TestRoutes = router;
