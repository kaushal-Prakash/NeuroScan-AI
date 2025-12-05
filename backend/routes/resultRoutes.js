import e from "express";
import { getAllResults } from "../controllers/resultController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = e.Router();

router.get("/get-user-results", authMiddleware, getAllResults);

export default router;
