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
      enum: ["pituitary", "glioma", "meningioma", "notumor"],
      required: true,
    },
    date: { type: Date, default: Date.now },
    confidence: { type: Number, required: true },
    imageUrl: { type: String }, // URL to the uploaded MRI image
    reportUrl: { type: String }, // URL to generated PDF report
    tumorType: { type: String }, // Human-readable tumor type
    notes: { type: String }, // Additional notes from doctor/user
  },
  { timestamps: true }
);

// Create new model if not exists, otherwise use existing model
export default mongoose.models.Result ||
  mongoose.model("Result", resultSchema);