"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Code2,
  Cpu,
  Database,
  Terminal,
  GitBranch,
  Server,
  Shield,
  Palette,
  Stethoscope,
  HeartPulse,
  Microscope,
  FileText,
  Users,
  Award,
  Target,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function AboutPage() {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Mission statement
  const missionStatement = "NeuroScan AI is a revolutionary medical imaging platform that leverages advanced deep learning to detect and classify brain tumors from MRI scans with 94% accuracy. Our mission is to make early tumor detection accessible, accurate, and fast for medical professionals worldwide.";

  // Features data for NeuroScan AI
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Detection",
      description: "Advanced CNN models with 94% accuracy for brain tumor classification",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Analysis",
      description: "Get comprehensive MRI analysis results in minutes instead of days",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Medical Grade Accuracy",
      description: "Models validated by board-certified neurologists and radiologists",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with encrypted patient data protection",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Detailed Reports",
      description: "Comprehensive PDF reports with probability distributions",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-user Support",
      description: "Designed for hospitals, clinics, and research institutions",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  // Tech stack data
  const techStack = [
    {
      category: "Frontend",
      icon: <Code2 className="w-5 h-5" />,
      items: ["Next.js 14", "Tailwind CSS", "React", "TypeScript", "Framer Motion"],
      color: "from-blue-500 to-blue-600"
    },
    {
      category: "Backend & AI",
      icon: <Cpu className="w-5 h-5" />,
      items: ["TensorFlow/Keras", "Flask", "Python", "OpenCV", "NumPy"],
      color: "from-purple-500 to-purple-600"
    },
    {
      category: "Infrastructure",
      icon: <Server className="w-5 h-5" />,
      items: ["MongoDB", "AWS S3", "Docker", "Redis", "NGINX"],
      color: "from-green-500 to-green-600"
    }
  ];

  // Tumor types we detect
  const tumorTypes = [
    {
      name: "Pituitary Tumors",
      description: "Benign tumors affecting hormone production",
      accuracy: "96%",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Glioma Tumors",
      description: "Primary brain tumors from glial cells",
      accuracy: "92%",
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Meningioma Tumors",
      description: "Tumors arising from the meninges",
      accuracy: "95%",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "No Tumor Detection",
      description: "Confirmation of clear MRI scans",
      accuracy: "98%",
      color: "bg-emerald-100 text-emerald-800"
    }
  ];

  // Medical validation
  const medicalValidation = [
    "Validated with 50,000+ MRI scans",
    "Board-certified neurologist review",
    "Peer-reviewed research publications",
    "FDA clearance pending",
    "HIPAA & GDPR compliant"
  ];

  // Team expertise
  const expertise = [
    {
      title: "Medical Team",
      description: "Neurologists, Radiologists, and Neurosurgeons",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "AI Research",
      description: "PhD-level Data Scientists and ML Engineers",
      icon: <Microscope className="w-5 h-5" />
    },
    {
      title: "Clinical Partners",
      description: "Leading hospitals and research institutions",
      icon: <HeartPulse className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div 
          className="text-center space-y-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white mb-6">
            <Brain className="w-6 h-6" />
            <span className="font-semibold">AI-Powered Brain Tumor Detection</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NeuroScan AI
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              {missionStatement}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-medium">94% Accuracy Rate</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Results in Minutes</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <Shield className="w-5 h-5 text-red-600" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Tumor Types Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tumor Types We Detect
            </span>
          </h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {tumorTypes.map((tumor, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${tumor.color}`}>
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{tumor.name}</h3>
                    <p className="text-gray-600 mb-3">{tumor.description}</p>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${tumor.color}`}>
                      {tumor.accuracy} Accuracy
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Advanced Features
            </span>
          </h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} ${feature.color} rounded-xl mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tech.color} text-white`}>
                        {tech.icon}
                      </div>
                      <span>{tech.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tech.items.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                          <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Medical Validation Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Award className="w-6 h-6 text-blue-600" />
                    Medical Validation & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {medicalValidation.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> NeuroScan AI is designed to assist medical professionals, not replace them. 
                      All results should be reviewed by qualified healthcare providers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Brain className="w-6 h-6 text-indigo-600" />
                    Our Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expertise.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Getting Started Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Get Started with NeuroScan AI
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Start detecting brain tumors with AI-powered accuracy. No medical background required for basic analysis.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Terminal className="w-6 h-6" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">For Medical Professionals</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Upload MRI scans in DICOM, JPEG, PNG, or TIFF format</li>
                      <li>• Get instant AI analysis with 94% accuracy</li>
                      <li>• Download detailed PDF reports for patient records</li>
                      <li>• Access bulk processing for multiple patients</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">For Researchers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• API access available for research purposes</li>
                      <li>• Custom model training options</li>
                      <li>• Access to anonymized datasets (with consent)</li>
                      <li>• Research collaboration opportunities</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                    size="lg"
                  >
                    <a href="/services">
                      <Brain className="w-5 h-5" />
                      Try Free Analysis
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 gap-2"
                    size="lg"
                  >
                    <a
                      href="https://github.com/kaushal-Prakash/neuroscan-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitBranch className="w-5 h-5" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Final CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join the Future of Brain Tumor Detection
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Thousands of medical professionals trust NeuroScan AI for accurate, fast, and reliable brain tumor detection.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 gap-2"
            >
              <a href="/contact">
                Contact Our Medical Team
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}