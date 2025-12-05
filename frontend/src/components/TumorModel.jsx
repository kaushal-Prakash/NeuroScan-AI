"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import jsPDF from "jspdf";
import {
  Upload,
  Download,
  XCircle,
  CheckCircle,
  AlertCircle,
  FileText,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import UpgradeModal from "./UpgradeModal";

const TumorModel = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const onDrop = (acceptedFiles) => {
    setError("");
    setResults(null);
    setProcessedImage("");

    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, JPEG, PNG)");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".tiff", ".bmp"],
    },
    maxFiles: 1,
  });

  const handleUpgradeSuccess = (upgradeData) => {
    console.log("Upgrade successful:", upgradeData);
    // You can refresh the page or show a success message
    window.location.reload(); // Simple refresh
  };

  const analyzeImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(30);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);
    let subscriptionStatus = null;
    try {
      // Fetch existing subscriptions to refresh session
      const subscriptionResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/status`,
        { withCredentials: true }
      );

      if (subscriptionResponse.data.success) {
        subscriptionStatus = subscriptionResponse.data.subscription;
        console.log("Subscription status:", subscriptionStatus);

        // Check if user is eligible
        if (!subscriptionStatus.eligible) {
          setProgress(0);
          setIsLoading(false);
          setError(subscriptionStatus.message);

          // Show upgrade modal if required
          if (subscriptionStatus.requiresUpgrade) {
            setShowUpgradeModal(true);
          }
          return;
        }
      }
    } catch (error) {
      console.error("Error geting subscriptions :", error);
    }
    try {
      console.log("Sending MRI image for analysis...");

      // First, get the current user's ID from your Node.js backend
      let userId = "demo_user"; // Default

      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user`,
          { withCredentials: true }
        );
        if (userResponse.data?.user?._id) {
          userId = userResponse.data.user._id;
        }
      } catch (userError) {
        console.log("Could not fetch user ID, using demo user");
      }

      // Make the prediction request to Flask
      const response = await axios.post(
        "http://127.0.0.1:5000/api/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-User-Id": userId, // Send user ID to Flask
          },
          timeout: 60000,
        }
      );

      console.log("Response received:", response.data);

      setProgress(100);

      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }

      const data = response.data;

      if (!data || data.status !== "success") {
        throw new Error("Invalid response from server");
      }

      // Save result to Node.js/MongoDB backend
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/results/save-flask-result`,
          data,
          { withCredentials: true }
        );
        console.log("Result saved to MongoDB");
      } catch (saveError) {
        console.warn("Could not save to MongoDB:", saveError.message);
        // Continue even if save fails
      }

      // Extract data from JSON response
      const confidence = data.confidence || 0;
      const tumorType = data.tumor_type || "unknown";
      const hasTumor = data.has_tumor || false;
      const diagnosis = data.diagnosis || "Unknown";
      const imageUrl = data.image_url || previewUrl;
      const probabilities = data.probabilities || {
        pituitary: 0.25,
        glioma: 0.25,
        meningioma: 0.25,
        notumor: 0.25,
      };

      // Format tumor type for display
      let displayTumorType = "Unknown";
      if (tumorType === "notumor") {
        displayTumorType = "No Tumor";
      } else if (tumorType === "pituitary") {
        displayTumorType = "Pituitary Tumor";
      } else if (tumorType === "glioma") {
        displayTumorType = "Glioma Tumor";
      } else if (tumorType === "meningioma") {
        displayTumorType = "Meningioma Tumor";
      }

      const result = {
        tumorType: displayTumorType,
        originalTumorType: tumorType,
        hasTumor: hasTumor,
        confidence: confidence,
        confidencePercentage:
          data.confidence_percentage || `${(confidence * 100).toFixed(2)}%`,
        imageUrl: imageUrl,
        filePath: data.file_path || `/uploads/${file.name}`,
        analysisDate: new Date().toISOString(),
        timestamp: data.timestamp || Date.now(),
        classIndex: data.class_index || 0,
        probabilities: probabilities,
        _id: data.mongo_id || `scan_${data.timestamp || Date.now()}`,
        date: new Date().toISOString(),
        userId: userId,
        createdAt: new Date().toISOString(),
        diagnosis: diagnosis,
      };

      console.log("Setting results:", result);
      setResults(result);
      setProcessedImage(imageUrl);
    } catch (err) {
      console.error("Analysis error details:", err);

      // Better error messages
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network error: Cannot connect to Flask server. Make sure it's running on port 5000."
        );
      } else if (err.code === "ECONNABORTED") {
        setError(
          "Request timeout. The image might be too large or the server is taking too long to respond."
        );
      } else if (err.response?.data?.message) {
        setError(`Server error: ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "An unexpected error occurred during analysis. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!results) return;

    // Create new PDF document
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: "Brain Tumor MRI Analysis Report",
      subject: "Medical Analysis Report",
      author: "NeuroScan AI",
    });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("NeuroScan AI - Brain Tumor MRI Analysis Report", 20, 30);

    // Add generation date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Report ID: ${results._id}`, 20, 52);

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 60, 190, 60);

    // Add analysis results
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Analysis Results:", 20, 75);

    // Result status with color coding
    const resultColor = results.hasTumor ? [220, 53, 69] : [40, 167, 69];

    doc.setFontSize(12);
    doc.setTextColor(...resultColor);
    doc.text(`Diagnosis: ${results.tumorType}`, 20, 90);

    doc.setTextColor(40, 40, 40);
    doc.text(`Confidence Level: ${results.confidencePercentage}`, 20, 100);

    // Add probability distribution
    doc.text("Probability Distribution:", 20, 120);

    const probabilities = [
      `Pituitary Tumor: ${Math.round(
        (results.probabilities?.pituitary || 0) * 100
      )}%`,
      `Glioma Tumor: ${Math.round(
        (results.probabilities?.glioma || 0) * 100
      )}%`,
      `Meningioma Tumor: ${Math.round(
        (results.probabilities?.meningioma || 0) * 100
      )}%`,
      `No Tumor: ${Math.round((results.probabilities?.notumor || 0) * 100)}%`,
    ];

    probabilities.forEach((prob, index) => {
      doc.text(prob, 20, 130 + index * 10);
    });

    // Add analysis details
    doc.text("Analysis Details:", 20, 175);
    doc.text(
      `Analysis Date: ${new Date(results.analysisDate).toLocaleDateString()}`,
      20,
      185
    );
    doc.text(
      `Analysis Time: ${new Date(results.analysisDate).toLocaleTimeString()}`,
      20,
      192
    );
    doc.text(`Patient ID: ${results.userId}`, 20, 199);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated by NeuroScan AI - Brain Tumor Detection System.",
      20,
      270
    );
    doc.text(
      "Please consult with a healthcare professional for medical advice.",
      20,
      275
    );

    // Save the PDF
    doc.save(`neuroscan-report-${Date.now()}.pdf`);
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreviewUrl("");
    setResults(null);
    setError("");
    setProcessedImage("");
    setProgress(0);
  };

  const getStatusIcon = () => {
    if (!results) return null;

    if (results.hasTumor) {
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    } else {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    if (!results) return "";

    if (results.hasTumor) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getTumorColor = (tumorType) => {
    switch (tumorType) {
      case "Pituitary Tumor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Glioma Tumor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Meningioma Tumor":
        return "bg-green-100 text-green-800 border-green-200";
      case "No Tumor":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl pt-4 font-bold text-gray-900">
                Brain Tumor MRI Analysis
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Upload a brain MRI scan to analyze for tumors (Pituitary,
                Glioma, Meningioma) or detect no tumor
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-3 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 shadow-inner"
                  : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-16 w-16 text-blue-400 mb-4" />
              <p className="text-lg font-medium text-gray-800 mb-2">
                {isDragActive
                  ? "Drop the MRI image here"
                  : "Drag & drop a brain MRI image, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, JPEG, PNG, TIFF, BMP (Max 20MB)
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Recommended: Brain MRI scans with clear visibility
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6 text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-gray-900 mb-2">
                      Analyzing MRI image...
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Classifying tumor type using AI model (94% accuracy)
                    </p>
                    <Progress
                      value={progress}
                      className="w-full max-w-md mx-auto h-2"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {progress}% complete
                    </p>
                  </div>
                </div>
              ) : results ? (
                <div className="space-y-8">
                  {/* Header with result */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon()}
                      <div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()} border`}
                        >
                          {results.tumorType.toUpperCase()}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Analysis completed •{" "}
                          {new Date(results.analysisDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={downloadPDF}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </Button>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          Original MRI Scan
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          Uploaded
                        </Badge>
                      </div>
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-4">
                        <img
                          src={previewUrl}
                          alt="Original MRI Scan"
                          className="w-full h-64 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          Processed Image
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          AI Analyzed
                        </Badge>
                      </div>
                      <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white p-4">
                        <img
                          src={results.imageUrl || previewUrl}
                          alt="Processed MRI Scan"
                          className="w-full h-64 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Analysis Results */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
                      Analysis Results
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Confidence Level */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            Confidence Level
                          </p>
                          <span className="text-sm font-bold text-blue-600">
                            {results.confidencePercentage}
                          </span>
                        </div>
                        <Progress
                          value={results.confidence * 100}
                          className="w-full h-3"
                          indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                        <p className="text-xs text-gray-500">
                          AI model confidence score for this diagnosis
                        </p>
                      </div>

                      {/* Tumor Probability Distribution */}
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-900">
                          Tumor Probability Distribution
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className={`p-3 rounded-lg border ${getTumorColor(
                              "Pituitary Tumor"
                            )}`}
                          >
                            <p className="text-xs font-medium mb-1">
                              Pituitary
                            </p>
                            <p className="text-lg font-bold">
                              {Math.round(
                                (results.probabilities?.pituitary || 0) * 100
                              )}
                              %
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-lg border ${getTumorColor(
                              "Glioma Tumor"
                            )}`}
                          >
                            <p className="text-xs font-medium mb-1">Glioma</p>
                            <p className="text-lg font-bold">
                              {Math.round(
                                (results.probabilities?.glioma || 0) * 100
                              )}
                              %
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-lg border ${getTumorColor(
                              "Meningioma Tumor"
                            )}`}
                          >
                            <p className="text-xs font-medium mb-1">
                              Meningioma
                            </p>
                            <p className="text-lg font-bold">
                              {Math.round(
                                (results.probabilities?.meningioma || 0) * 100
                              )}
                              %
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-lg border ${getTumorColor(
                              "No Tumor"
                            )}`}
                          >
                            <p className="text-xs font-medium mb-1">No Tumor</p>
                            <p className="text-lg font-bold">
                              {Math.round(
                                (results.probabilities?.notumor || 0) * 100
                              )}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Analysis Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Diagnosis</p>
                            <p
                              className={`font-semibold ${
                                results.hasTumor
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {results.tumorType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Analysis Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                results.analysisDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge
                              variant={
                                results.hasTumor ? "destructive" : "default"
                              }
                              className="mt-1"
                            >
                              {results.hasTumor
                                ? "Tumor Detected"
                                : "No Tumor Detected"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Report ID</p>
                            <p className="font-mono text-xs text-gray-700">
                              {results._id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetAnalysis}
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      Analyze Another MRI Image
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.href = "/dashboard")}
                      className="flex-1"
                    >
                      View Scan History
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        MRI Scan Preview
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Ready for Analysis
                      </Badge>
                    </div>
                    <div className="border-2 border-dashed border-blue-300 rounded-xl overflow-hidden bg-gray-50 p-6">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-96 object-contain mx-auto rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      File: {file.name} • Size:{" "}
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={analyzeImage}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12"
                      size="lg"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Analyze MRI Image
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetAnalysis}
                      className="h-12"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      By analyzing, you agree that this is for educational
                      purposes only.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Analysis Error</p>
                  <p className="text-red-600 mt-1">{error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      // Check Flask server status
                      axios
                        .get("http://127.0.0.1:5000/api/health")
                        .then((res) =>
                          console.log("Flask server status:", res.data)
                        )
                        .catch((err) =>
                          console.error("Flask server check failed:", err)
                        );
                    }}
                  >
                    Check Server Status
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgradeSuccess}
      />
    </div>
  );
};

export default TumorModel;
