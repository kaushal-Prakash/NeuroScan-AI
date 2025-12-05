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

const CovidModel = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState("");

  const onDrop = (acceptedFiles) => {
    setError("");
    setResults(null);
    setProcessedImage("");

    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file");
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
    setProgress(0);
    setError("");

    const formData = new FormData();
    formData.append("xray", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("AI Analysis Response:", response);
      setProgress(100);

      if (response.status !== 200) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.data;
      console.log("AI Analysis Results:", data);
      setResults(data);

      // If the response includes a processed image
      if (data.processed_image) {
        setProcessedImage(data.processed_image);
      }

      // Simulate processed image for demo if not available
      if (!data.processed_image && previewUrl) {
        setProcessedImage(previewUrl);
      }
    } catch (err) {
      setError(err.message || "An error occurred during analysis");
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
      title: "COVID-19 X-Ray Analysis Report",
      subject: "Medical Analysis Report",
      author: "COVID-19 Analysis System",
    });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("COVID-19 X-Ray Analysis Report", 20, 30);

    // Add generation date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50);

    // Add patient information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Patient Information:", 20, 65);

    doc.setFontSize(12);
    doc.text(`Patient ID: ${results.userId || "N/A"}`, 20, 75);
    doc.text(
      `Analysis Date: ${new Date(results.date).toLocaleDateString()}`,
      20,
      85
    );

    // Add results section
    doc.setFontSize(14);
    doc.text("Analysis Results:", 20, 105);

    // Result status with color coding
    const resultColor =
      results.case === "covid"
        ? [220, 53, 69]
        : results.case === "viral"
        ? [255, 193, 7]
        : [40, 167, 69];

    doc.setFontSize(12);
    doc.setTextColor(...resultColor);
    doc.text(`Result: ${results.case.toUpperCase()}`, 20, 120);

    doc.setTextColor(40, 40, 40);
    doc.text(
      `Confidence Level: ${Math.round(results.confidence * 100)}%`,
      20,
      130
    );

    // Add probability distribution
    doc.text("Probability Distribution:", 20, 150);

    // Since your response doesn't have probabilities, we'll calculate based on confidence
    const covidProb = results.case === "covid" ? results.confidence : (1 - results.confidence) / 2;
    const viralProb = results.case === "viral" ? results.confidence : (1 - results.confidence) / 2;
    const normalProb = results.case === "normal" ? results.confidence : (1 - results.confidence) / 2;

    const probabilities = [
      `COVID-19: ${Math.round(covidProb * 100)}%`,
      `Viral Pneumonia: ${Math.round(viralProb * 100)}%`,
      `Normal Lungs: ${Math.round(normalProb * 100)}%`,
    ];

    probabilities.forEach((prob, index) => {
      doc.text(prob, 20, 160 + index * 10);
    });

    // Add additional information from your response
    doc.text("Report Details:", 20, 190);
    doc.text(`Report ID: ${results._id}`, 20, 200);
    doc.text(`Created: ${new Date(results.createdAt).toLocaleDateString()}`, 20, 210);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated by the COVID-19 X-Ray Analysis System.",
      20,
      270
    );
    doc.text(
      "Please consult with a healthcare professional for medical advice.",
      20,
      275
    );

    // Save the PDF
    doc.save(`covid-analysis-${results.userId || Date.now()}.pdf`);
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

    switch (results.case) {
      case "covid":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "viral":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case "normal":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    if (!results) return "";

    switch (results.case) {
      case "covid":
        return "bg-red-100 text-red-800";
      case "viral":
        return "bg-yellow-100 text-yellow-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate probabilities for display since your response doesn't include them
  const getProbabilities = () => {
    if (!results) return { covid: 0, viral: 0, normal: 0 };

    if (results.probabilities) {
      return results.probabilities;
    }

    // Calculate probabilities based on confidence and case
    const confidence = results.confidence;
    const remaining = 1 - confidence;
    
    switch (results.case) {
      case "covid":
        return {
          covid: confidence,
          viral: remaining / 2,
          normal: remaining / 2
        };
      case "viral":
        return {
          covid: remaining / 2,
          viral: confidence,
          normal: remaining / 2
        };
      case "normal":
        return {
          covid: remaining / 2,
          viral: remaining / 2,
          normal: confidence
        };
      default:
        return {
          covid: 0.33,
          viral: 0.33,
          normal: 0.34
        };
    }
  };

  const probabilities = getProbabilities();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            COVID-19 X-Ray Analysis
          </CardTitle>
          <CardDescription>
            Upload a chest X-ray image to analyze for COVID-19, viral pneumonia,
            or normal lungs
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
                  ? "Drop the image here"
                  : "Drag and drop an X-ray image, or click to select"}
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
                    <p className="font-medium">Analyzing X-ray image...</p>
                    <p className="text-sm text-gray-500">
                      This may take a few moments
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
                        {results.case.toUpperCase()}
                      </span>
                    </div>
                    <Button onClick={downloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </Button>
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Original X-Ray</h3>
                      <img
                        src={previewUrl}
                        alt="Original X-ray"
                        className="rounded-md border w-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Processed Image</h3>
                      <img
                        src={processedImage || previewUrl}
                        alt="Processed X-ray"
                        className="rounded-md border w-full"
                      />
                    </div>
                  </div> */}

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Analysis Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Confidence Level</p>
                        <Progress
                          value={results.confidence * 100}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          {Math.round(results.confidence * 100)}%
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Probability Distribution
                        </p>
                        <div className="flex space-x-2">
                          <Badge
                            variant={
                              results.case === "covid" ? "default" : "secondary"
                            }
                            className="flex-1"
                          >
                            COVID: {Math.round(probabilities.covid * 100)}%
                          </Badge>
                          <Badge
                            variant={
                              results.case === "viral" ? "default" : "secondary"
                            }
                            className="flex-1"
                          >
                            Viral: {Math.round(probabilities.viral * 100)}%
                          </Badge>
                          <Badge
                            variant={
                              results.case === "normal"
                                ? "default"
                                : "secondary"
                            }
                            className="flex-1"
                          >
                            Normal: {Math.round(probabilities.normal * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium mb-2">Report Details</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Report ID:</span>
                          <p className="font-mono">{results._id}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Analysis Date:</span>
                          <p>{new Date(results.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <p>{new Date(results.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Patient ID:</span>
                          <p>{results.userId}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetAnalysis}
                    className="w-full"
                  >
                    Analyze Another Image
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
                      Analyze Image
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
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CovidModel;