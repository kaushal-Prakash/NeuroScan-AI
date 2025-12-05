import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    case: {
      type: String,
      enum: ["covid", "normal", "viral"],
      required: true,
    },
    date: { type: Date },
    confidence: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create new model if not exists, otherwise use existing model
export default mongoose.models.Result ||
  mongoose.model("Result", resultSchema);
