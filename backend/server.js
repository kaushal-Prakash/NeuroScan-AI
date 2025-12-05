import "dotenv/config";
import e from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./services/mongo.js";
import resultRoutes from "./routes/resultRoutes.js";

const app = e();

app.use(e.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

//routes
app.use("/auth",authRoutes);
app.use("/otp", (await import("./routes/otpRoutes.js")).default);
app.use("/ai", aiRoutes);
app.use("/results", resultRoutes);

//connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
