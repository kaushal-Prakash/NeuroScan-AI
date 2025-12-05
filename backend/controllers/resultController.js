import Result from "../models/Result.js";
import User from "../models/User.js";
import { checkScanEligibility, recordScanUsage } from "./subscriptionController.js";

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

    // Check subscription eligibility
    const eligibility = await checkScanEligibility(userId);
    
    if (!eligibility.eligible) {
      return res.status(402).json({ 
        error: eligibility.reason,
        requiresUpgrade: eligibility.upgradeRequired || false,
        scansRemaining: eligibility.scansRemaining,
        message: eligibility.reason
      });
    }

    // Validate tumor case
    const validCases = ['pituitary', 'glioma', 'meningioma', 'notumor'];
    if (!validCases.includes(tumorCase)) {
      return res.status(400).json({ error: 'Invalid tumor case type' });
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

    // Record scan usage
    const usage = await recordScanUsage(userId);
    
    if (!usage.success) {
      console.error("Failed to record scan usage:", usage.error);
    }

    res.status(201).json({
      message: 'Result saved successfully',
      result,
      subscription: {
        scansRemaining: usage.scansRemaining || eligibility.scansRemaining,
        scansUsed: usage.scansUsed || 0,
        userType: eligibility.userType,
        message: eligibility.message
      }
    });
  } catch (error) {
    console.error("Error in createResult:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add similar check for Flask results
const saveFlaskResult = async (req, res) => {
  try {
    const {
      tumor_type,
      confidence,
      image_url,
      diagnosis,
      probabilities,
      has_tumor,
      timestamp
    } = req.body;
    
    const userId = req.user._id;

    // Check subscription eligibility
    const eligibility = await checkScanEligibility(userId);
    
    if (!eligibility.eligible) {
      return res.status(402).json({ 
        success: false,
        error: eligibility.reason,
        code: eligibility.code,
        requiresUpgrade: eligibility.upgradeRequired || false,
        scansUsed: eligibility.scansUsed || 0,
        scansRemaining: eligibility.scansRemaining || 0,
        limit: eligibility.limit || 0,
        period: eligibility.period || null,
        message: eligibility.reason
      });
    }

    // Validate tumor case
    const validCases = ['pituitary', 'glioma', 'meningioma', 'notumor'];
    if (!validCases.includes(tumor_type)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid tumor case type' 
      });
    }

    // Create new result
    const result = new Result({
      userId,
      case: tumor_type,
      confidence,
      date: new Date(timestamp * 1000),
      imageUrl: image_url,
      tumorType: diagnosis,
      probabilities,
      hasTumor: has_tumor
    });

    await result.save();

    // Record scan usage
    const usage = await recordScanUsage(userId);
    
    if (!usage.success) {
      console.error("Failed to record scan usage:", usage.error);
    }

    res.status(201).json({
      success: true,
      message: 'Result saved successfully',
      result: {
        id: result._id,
        case: result.case,
        confidence: result.confidence,
        date: result.date,
        tumorType: result.tumorType
      },
      subscription: {
        eligible: usage.eligibility.eligible,
        scansRemaining: usage.eligibility.scansRemaining,
        scansUsed: usage.eligibility.scansUsed || 0,
        userType: usage.eligibility.userType,
        message: usage.eligibility.message,
        period: usage.eligibility.period
      },
      usage: {
        totalScans: usage.totalScans,
        weeklyScans: usage.weeklyScans
      }
    });
  } catch (error) {
    console.error("Error in saveFlaskResult:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
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

const syncResults = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Get results from Flask MongoDB
    let flaskResults = [];
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user/results', {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      if (response.data.status === 'success') {
        flaskResults = response.data.results;
      }
    } catch (flaskError) {
      console.log('Could not fetch from Flask:', flaskError.message);
    }
    
    // 2. Get results from Node.js MongoDB
    const nodeResults = await Result.find({ userId: userId });
    
    // 3. Combine and deduplicate
    const allResults = [...nodeResults];
    
    for (const flaskResult of flaskResults) {
      // Check if result already exists in Node.js DB
      const exists = allResults.some(nodeResult => 
        nodeResult.case === flaskResult.case &&
        new Date(nodeResult.date).getTime() === new Date(flaskResult.date).getTime() &&
        nodeResult.confidence === flaskResult.confidence
      );
      
      if (!exists) {
        // Save Flask result to Node.js DB
        const newResult = new Result({
          userId: userId,
          case: flaskResult.case,
          confidence: flaskResult.confidence,
          date: flaskResult.date,
          imageUrl: flaskResult.imageUrl,
          tumorType: flaskResult.tumorType,
          probabilities: flaskResult.probabilities,
          hasTumor: flaskResult.hasTumor
        });
        await newResult.save();
        allResults.push(newResult);
      }
    }
    
    // 4. Return combined results
    res.status(200).json({
      message: 'Results synced successfully',
      totalResults: allResults.length,
      newFromFlask: flaskResults.length,
      existingInNode: nodeResults.length,
      results: allResults.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
    
  } catch (error) {
    console.error('Error in syncResults:', error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllResults,
  createResult,
  getResultById,
  deleteResult,
  saveFlaskResult,
  syncResults
};