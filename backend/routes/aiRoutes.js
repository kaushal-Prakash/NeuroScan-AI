import express from "express";
import multer from "multer";
import { predict } from "../controllers/aiController.js";
import path from "path";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer storage config: use date + timestamp as filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `xray_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/predict", authMiddleware, upload.single("xray"), predict);

export default router;
 