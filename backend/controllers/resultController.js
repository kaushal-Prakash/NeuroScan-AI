import Result from "../models/Result.js";

const getAllResults = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log("Fetching results for user ID:", userId);
    console.log("User object:", req.user);

    const results = await Result.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email'); // Populate user data if needed
    
    console.log("Found results:", results.length);
    
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getAllResults:", error);
    res.status(500).json({ error: error.message });
  }
};

const createResult = async (req, res) => {
  try {
    const { case: tumorCase, confidence, imageUrl, tumorType, notes } = req.body;
    const userId = req.user._id;

    // Validate tumor case
    const validCases = ['pituitary', 'glioma', 'meningioma', 'notumor'];
    if (!validCases.includes(tumorCase)) {
      return res.status(400).json({ error: 'Invalid tumor case type' });
    }

    // Check if user has free scans available
    const user = await User.findById(userId);
    if (!user.freeScansAvailable && !user.isPremium) {
      return res.status(402).json({ 
        error: 'No scans available. Please upgrade your plan.',
        requiresUpgrade: true 
      });
    }

    // Create new result
    const result = new Result({
      userId,
      case: tumorCase,
      confidence,
      date: new Date(),
      imageUrl,
      tumorType: tumorType || tumorCase,
      notes
    });

    await result.save();

    // Update user's scan count
    if (!user.isPremium) {
      user.freeScansAvailable = Math.max(0, user.freeScansAvailable - 1);
    }
    user.totalScans += 1;
    await user.save();

    res.status(201).json({
      message: 'Result saved successfully',
      result,
      scansRemaining: user.freeScansAvailable,
      isPremium: user.isPremium
    });
  } catch (error) {
    console.error("Error in createResult:", error);
    res.status(500).json({ error: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Result.findOne({ _id: id, userId: userId });
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getResultById:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Result.findOneAndDelete({ _id: id, userId: userId });
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error("Error in deleteResult:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllResults,
  createResult,
  getResultById,
  deleteResult
};