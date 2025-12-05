import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Result from "../models/Result.js";
import aiResponse from "../utils/gemini.js";

async function analyzeXray(base64Image) {
  try {
    // Call AI
    let aiResultRaw = await aiResponse({
      task: `
You are an AI medical image analyzer.

Input: A chest X-ray image in base64: ${base64Image}.

Task: Classify the image as "covid", "normal", or "viral".

Output ONLY valid JSON in this format:
{
  "case": "<covid | normal | viral>",
  "confidence": <number between 0 and 1>,
  "date": "<ISO date string>"
}
Do not include any extra text, explanation, or markdown.
`,
    });

    // Remove Markdown code blocks like ```json ... ```
    aiResultRaw = aiResultRaw.replace(/```json|```/g, "").trim();

    // Parse JSON
    const aiResult = JSON.parse(aiResultRaw);

    return aiResult;
  } catch (error) {
    console.error("AI analysis error:", error);
    throw new Error("AI analysis failed");
  }
}

const predict = async (req, res) => {
  const userId  = req.user?._id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  // Use file.path instead of file.destination + file.filename
  const filePath = file.path; 
  const fileData = fs.readFileSync(filePath);
  const base64Image = fileData.toString("base64");

  let aiResult;
  try {
    aiResult = await analyzeXray(base64Image);
  } catch (err) {
    // delete file even if AI fails
    try { fs.unlinkSync(filePath); } catch(_) {}
    return res.status(500).json({ error: "AI analysis failed" });
  }

  // Save result in DB
  const resultDoc = new Result({
    userId: new mongoose.Types.ObjectId(userId),
    case: aiResult.case,
    confidence: aiResult.confidence,
    date: new Date(aiResult.date),
    imageUrl: `/uploads/${file.filename}`,
  });

  await resultDoc.save();

  // Delete local file after saving
  try {
    fs.unlinkSync(filePath);
    console.log("File deleted:", filePath);
  } catch (err) {
    console.warn("Failed to delete file:", filePath, err.message);
  }

  res.status(200).json(resultDoc);
};


export { predict };
