import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    subscriptionId: { type: String, default: null },
    role: { 
      type: String, 
      enum: ["patient", "doctor", "researcher", "admin"], 
      default: "patient" 
    },
    institution: { type: String },
    medicalLicense: { type: String }, // For doctors
    freeScansAvailable: { type: Number, default: 1 }, // One free scan for new users
    totalScans: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

//create new model if not exists
// otherwise use existing model
export default mongoose.models.User || mongoose.model("User", userSchema);