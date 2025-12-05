import e from "express";
import { getAllResults, saveFlaskResult } from "../controllers/resultController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = e.Router();

router.get("/get-user-results", authMiddleware, getAllResults);
router.post("/save-flask-result", authMiddleware, saveFlaskResult); 

export default router;
