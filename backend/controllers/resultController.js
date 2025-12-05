import Result from "../models/Result.js";

const getAllResults = async (req, res) => {
  try {
    // Method 1: If using populate or direct access
    const userId = req.user._id;
    
    // Method 2: If _id is nested
    // const userId = req.user._id || req.user.id;
    
    console.log("User ID from request:", userId);
    console.log("User object:", req.user);

    const results = await Result.find({ userId: userId }).sort({ createdAt: -1 });
    
    console.log("Found results:", results);
    
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getAllResults:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
    getAllResults
}