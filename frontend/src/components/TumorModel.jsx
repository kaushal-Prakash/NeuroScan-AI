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

const TumorModel = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    setError("");
    setResults(null);

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
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const analyzeImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(30);
    setError("");

    const formData = new FormData();
    formData.append("file", file); // Changed from 'xray' to 'file' to match Flask backend

    try {
      // Direct call to Flask backend
      const response = await axios.post(
        "http://localhost:5000/", // Your Flask app runs on port 5000
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setProgress(100);

      if (response.status !== 200) {
        throw new Error("Analysis failed. Please try again.");
      }

      // Parse the HTML response to get the result
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, "text/html");
      const resultText = doc.querySelector('.result-text')?.textContent || "";
      const confidenceText = doc.querySelector('.confidence')?.textContent || "";
      const filePath = doc.querySelector('img[src*="uploads"]')?.src || previewUrl;

      // Extract confidence percentage
      const confidenceMatch = confidenceText.match(/(\d+\.?\d*)%/);
      const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) / 100 : 0;

      // Parse result
      let tumorType = "Unknown";
      let hasTumor = false;
      
      if (resultText.includes("No Tumor")) {
        tumorType = "No Tumor";
        hasTumor = false;
      } else if (resultText.includes("pituitary")) {
        tumorType = "Pituitary Tumor";
        hasTumor = true;
      } else if (resultText.includes("glioma")) {
        tumorType = "Glioma Tumor";
        hasTumor = true;
      } else if (resultText.includes("meningioma")) {
        tumorType = "Meningioma Tumor";
        hasTumor = true;
      }

      setResults({
        tumorType,
        hasTumor,
        confidence,
        filePath: filePath.startsWith('http') ? filePath : `http://localhost:5000${filePath}`,
        analysisDate: new Date().toISOString(),
        probabilities: {
          pituitary: tumorType === "Pituitary Tumor" ? confidence : (1 - confidence) / 3,
          glioma: tumorType === "Glioma Tumor" ? confidence : (1 - confidence) / 3,
          meningioma: tumorType === "Meningioma Tumor" ? confidence : (1 - confidence) / 3,
          notumor: tumorType === "No Tumor" ? confidence : (1 - confidence) / 3
        }
      });

    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.response?.data?.error || err.message || "An error occurred during analysis");
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
      author: "Brain Tumor Analysis System",
    });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Brain Tumor MRI Analysis Report", 20, 30);

    // Add generation date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50);

    // Add analysis results
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Analysis Results:", 20, 65);

    // Result status with color coding
    const resultColor = results.hasTumor ? [220, 53, 69] : [40, 167, 69];
    
    doc.setFontSize(12);
    doc.setTextColor(...resultColor);
    doc.text(`Diagnosis: ${results.tumorType}`, 20, 80);

    doc.setTextColor(40, 40, 40);
    doc.text(`Confidence Level: ${Math.round(results.confidence * 100)}%`, 20, 90);

    // Add probability distribution
    doc.text("Probability Distribution:", 20, 110);

    const probabilities = [
      `Pituitary Tumor: ${Math.round(results.probabilities.pituitary * 100)}%`,
      `Glioma Tumor: ${Math.round(results.probabilities.glioma * 100)}%`,
      `Meningioma Tumor: ${Math.round(results.probabilities.meningioma * 100)}%`,
      `No Tumor: ${Math.round(results.probabilities.notumor * 100)}%`,
    ];

    probabilities.forEach((prob, index) => {
      doc.text(prob, 20, 120 + index * 10);
    });

    // Add analysis details
    doc.text("Analysis Details:", 20, 165);
    doc.text(`Analysis Date: ${new Date(results.analysisDate).toLocaleDateString()}`, 20, 175);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated by the Brain Tumor MRI Analysis System.",
      20,
      270
    );
    doc.text(
      "Please consult with a healthcare professional for medical advice.",
      20,
      275
    );

    // Save the PDF
    doc.save(`brain-tumor-analysis-${Date.now()}.pdf`);
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreviewUrl("");
    setResults(null);
    setError("");
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">
              Brain Tumor MRI Analysis
            </CardTitle>
          </div>
          <CardDescription>
            Upload a brain MRI scan to analyze for tumors (Pituitary, Glioma, Meningioma) or detect no tumor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-blue-500 rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4">
                {isDragActive
                  ? "Drop the MRI image here"
                  : "Drag and drop a brain MRI image, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, JPEG, PNG
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="font-medium">Analyzing MRI image...</p>
                    <p className="text-sm text-gray-500">
                      Classifying tumor type using AI model
                    </p>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon()}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                      >
                        {results.tumorType.toUpperCase()}
                      </span>
                    </div>
                    <Button onClick={downloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">MRI Scan</h3>
                      <img
                        src={results.filePath}
                        alt="MRI Scan"
                        className="rounded-md border w-full max-h-96 object-contain bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Analysis Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Confidence Level</p>
                        <Progress
                          value={results.confidence * 100}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          {Math.round(results.confidence * 100)}% confidence
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Tumor Probability Distribution
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Badge
                            variant={
                              results.tumorType === "Pituitary Tumor" ? "default" : "secondary"
                            }
                            className="flex justify-center"
                          >
                            Pituitary: {Math.round(results.probabilities.pituitary * 100)}%
                          </Badge>
                          <Badge
                            variant={
                              results.tumorType === "Glioma Tumor" ? "default" : "secondary"
                            }
                            className="flex justify-center"
                          >
                            Glioma: {Math.round(results.probabilities.glioma * 100)}%
                          </Badge>
                          <Badge
                            variant={
                              results.tumorType === "Meningioma Tumor" ? "default" : "secondary"
                            }
                            className="flex justify-center"
                          >
                            Meningioma: {Math.round(results.probabilities.meningioma * 100)}%
                          </Badge>
                          <Badge
                            variant={
                              results.tumorType === "No Tumor" ? "default" : "secondary"
                            }
                            className="flex justify-center"
                          >
                            No Tumor: {Math.round(results.probabilities.notumor * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium mb-2">Analysis Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Diagnosis:</span>
                          <p className={`font-semibold ${results.hasTumor ? 'text-red-600' : 'text-green-600'}`}>
                            {results.tumorType}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Analysis Date:</span>
                          <p>{new Date(results.analysisDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <p>{Math.round(results.confidence * 100)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p>{results.hasTumor ? "Tumor Detected" : "No Tumor Detected"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetAnalysis}
                    className="w-full"
                  >
                    Analyze Another MRI Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded-md border max-h-64"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={analyzeImage} className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Analyze MRI Image
                    </Button>
                    <Button variant="outline" onClick={resetAnalysis}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TumorModel;