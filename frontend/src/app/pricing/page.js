"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaBrain,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaSync,
  FaEye,
  FaPlug,
  FaCogs,
  FaUserLock,
  FaLaptop,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaHospital,
  FaStethoscope,
  FaUserMd,
  FaHeartbeat,
  FaMicroscope,
  FaFileMedical,
  FaRobot,
  FaQrcode,
  FaUpload,
  FaCreditCard,
  FaPaypal,
  FaGoogle,
  FaApple,
  FaInfoCircle,
  FaClock,
  FaUsers,
  FaGlobe,
  FaLock,
  FaServer,
  FaHeadset,
  FaDatabase,
  FaCode,
  FaMedal,
  FaAward,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { BsShieldCheck, BsLightningCharge } from "react-icons/bs";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1.02 },
};

const glowEffect = {
  rest: { boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" },
  hover: { 
    boxShadow: "0px 8px 30px rgba(59, 130, 246, 0.15), 0px 0px 0px 1px rgba(59, 130, 246, 0.3)" 
  },
};

// Enhanced UPI QR Payment Component
const EnhancedUPIPayment = ({ plan, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("qr");
  const [screenshot, setScreenshot] = useState(null);

  const upiId = "thoraxai@upi";
  const amount = parseFloat(plan.price.replace("$", ""));
  const upiLink = `upi://pay?pa=${upiId}&pn=Thorax AI&am=${amount}&cu=INR&tn=${plan.title}`;

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshot(e.target.result);
        setStep("success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Complete Purchase</DialogTitle>
              <DialogDescription className="text-blue-100">
                {plan.title} - {plan.price}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center py-4 bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className={`flex items-center ${step === "qr" ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "qr" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <FaQrcode className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Scan QR</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200" />
              <div className={`flex items-center ${step === "upload" ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "upload" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <FaUpload className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Upload</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200" />
              <div className={`flex items-center ${step === "success" ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "success" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <IoMdCheckmarkCircleOutline className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Done</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "qr" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FaQrcode className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Scan to Pay</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Scan this QR code with any UPI app to complete your payment
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=3b82f6&margin=10`}
                    alt="UPI QR Code"
                    className="w-48 h-48 rounded-lg"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="font-bold text-lg">{plan.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">UPI ID</span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                      {upiId}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep("upload")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    I've Paid
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "upload" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <FaUpload className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Proof</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Please upload a screenshot of your payment confirmation
                  </p>
                </div>

                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  onClick={() => document.getElementById("screenshot-input").click()}
                >
                  <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Click to upload screenshot</p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    id="screenshot-input"
                    onChange={handleScreenshotUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("qr")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => document.getElementById("screenshot-input").click()}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    Choose File
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <IoMdCheckmarkCircleOutline className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600">
                    Your {plan.title} plan has been activated
                  </p>
                </div>
                <div className="animate-pulse">
                  <p className="text-sm text-gray-500">
                    Redirecting you to dashboard...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Pricing Plans Data
const pricingPlans = [
  {
    id: "single",
    title: "Single Scan",
    subtitle: "One-time comprehensive analysis",
    price: "₹49.99",
    period: "one time",
    description: "Get one comprehensive brain MRI analysis report.",
    features: [
      { text: "One-time MRI analysis", icon: <FaFileMedical className="w-4 h-4" /> },
      { text: "Detailed tumor classification", icon: <FaBrain className="w-4 h-4" /> },
      { text: "PDF medical report", icon: <FaFileMedical className="w-4 h-4" /> },
      { text: "Basic visualization", icon: <FaEye className="w-4 h-4" /> },
      { text: "Email support", icon: <FaHeadset className="w-4 h-4" /> },
    ],
    popular: false,
    value: false,
    icon: <FaFileMedical className="w-6 h-6" />,
    color: "blue",
    highlight: false,
  },
  {
    id: "weekly",
    title: "Weekly Access",
    subtitle: "Unlimited scans for 7 days",
    price: "₹149.99",
    period: "/ week",
    description: "Ideal for patient monitoring and short-term needs.",
    features: [
      { text: "Unlimited MRI analyses", icon: <FaSync className="w-4 h-4" /> },
      { text: "Advanced tumor detection", icon: <FaRobot className="w-4 h-4" /> },
      { text: "Comparative reports", icon: <FaChartLine className="w-4 h-4" /> },
      { text: "Priority processing", icon: <BsLightningCharge className="w-4 h-4" /> },
      { text: "Email & chat support", icon: <FaHeadset className="w-4 h-4" /> },
    ],
    popular: false,
    value: false,
    icon: <FaSync className="w-6 h-6" />,
    color: "purple",
    highlight: false,
  },
  {
    id: "monthly",
    title: "Monthly Pro",
    subtitle: "For medical professionals",
    price: "₹399.99",
    period: "/ month",
    description: "Best value for clinics and regular users.",
    features: [
      { text: "Unlimited scans", icon: <FaGlobe className="w-4 h-4" /> },
      { text: "Multi-patient management", icon: <FaUsers className="w-4 h-4" /> },
      { text: "Advanced analytics dashboard", icon: <FaChartLine className="w-4 h-4" /> },
      { text: "2-hour processing guarantee", icon: <FaClock className="w-4 h-4" /> },
      { text: "Priority phone support", icon: <FaHeadset className="w-4 h-4" /> },
      { text: "HIPAA compliant", icon: <FaLock className="w-4 h-4" /> },
      { text: "Basic API access", icon: <FaCode className="w-4 h-4" /> },
    ],
    popular: true,
    value: false,
    icon: <FaUserMd className="w-6 h-6" />,
    color: "indigo",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    subtitle: "For hospitals & research",
    price: "₹2999.99",
    period: "/ year",
    description: "Full platform access with custom solutions.",
    features: [
      { text: "All Pro features included", icon: <FaMedal className="w-4 h-4" /> },
      { text: "Custom AI model training", icon: <FaCogs className="w-4 h-4" /> },
      { text: "Full API integration", icon: <FaPlug className="w-4 h-4" /> },
      { text: "1-hour processing SLA", icon: <FaClock className="w-4 h-4" /> },
      { text: "24/7 dedicated support", icon: <FaServer className="w-4 h-4" /> },
      { text: "Bulk processing", icon: <FaDatabase className="w-4 h-4" /> },
      { text: "Research collaboration", icon: <FaMicroscope className="w-4 h-4" /> },
      { text: "White-label solution", icon: <FaAward className="w-4 h-4" /> },
    ],
    popular: false,
    value: true,
    icon: <FaHospital className="w-6 h-6" />,
    color: "amber",
    highlight: false,
    badge: "Best Value",
  },
];

// Main Pricing Page Component
const EnhancedPricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(pricingPlans[2]); // Default to Monthly Pro
  const [showPayment, setShowPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful for:", selectedPlan.title);
    // Redirect to dashboard or show success message
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative container mx-auto px-4 pt-20 pb-16 text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            <FaStar className="w-4 h-4" />
            Trusted by medical professionals worldwide
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            Choose the perfect plan for your needs. All plans include our 
            industry-leading AI with 94% accuracy. No hidden fees, no surprises.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white p-1 rounded-full border shadow-sm mb-12"
          >
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly Billing
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pb-20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="h-full"
            >
              <motion.div
                variants={cardHoverVariants}
                className="h-full"
                style={glowEffect}
              >
                <Card className={`h-full flex flex-col border-2 relative overflow-hidden ${
                  plan.highlight 
                    ? "border-blue-300 shadow-xl" 
                    : "border-gray-200 hover:border-gray-300"
                } transition-all duration-300`}>
                  {plan.highlight && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                        RECOMMENDED
                      </div>
                    </div>
                  )}
                  
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 shadow-lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={`pb-4 ${
                    plan.highlight 
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50/50" 
                      : ""
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        plan.color === "blue" ? "bg-blue-100 text-blue-600" :
                        plan.color === "purple" ? "bg-purple-100 text-purple-600" :
                        plan.color === "indigo" ? "bg-indigo-100 text-indigo-600" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        {plan.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{plan.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {plan.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pt-6">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {plan.price}
                        <span className="text-lg font-normal text-gray-500">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-500" />
                          </div>
                          <span className="ml-3 text-sm text-gray-700">
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button
                      className={`w-full py-6 text-base font-medium ${
                        plan.highlight
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                      }`}
                      onClick={() => handlePurchase(plan)}
                    >
                      {plan.id === "single" ? "Purchase Scan" : "Get Started"}
                      <FaArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-gray-600">
              See how our plans stack up against each other
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-6 font-semibold text-gray-900">
                    Features
                  </th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.id} className="p-6 text-center">
                      <div className="font-semibold text-gray-900">{plan.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{plan.price}{plan.period}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "MRI Scans",
                  "AI Accuracy",
                  "Processing Time",
                  "PDF Reports",
                  "API Access",
                  "Support",
                  "Multi-patient",
                  "HIPAA Compliance",
                  "Custom Models",
                ].map((feature, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-6 font-medium text-gray-900">{feature}</td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="p-6 text-center">
                        {plan.id === "single" && idx < 5 ? (
                          <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-500 mx-auto" />
                        ) : plan.id === "weekly" && idx < 6 ? (
                          <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-500 mx-auto" />
                        ) : plan.id === "monthly" && idx < 8 ? (
                          <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-500 mx-auto" />
                        ) : plan.id === "enterprise" ? (
                          <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
                <p className="text-gray-600">AI Accuracy Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
                <p className="text-gray-600">Scans Processed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <p className="text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Get answers to common questions about our pricing and plans
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "How does the free trial work?",
                a: "You get 3 free MRI scans per week with our free plan. No credit card required to start."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes, you can change your plan at any time. The change will take effect immediately."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and UPI payments in India."
              },
              {
                q: "Is my medical data secure?",
                a: "Yes, all data is encrypted, HIPAA compliant, and never shared with third parties."
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your medical imaging?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of medical professionals who trust our AI-powered MRI analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8"
              onClick={() => window.location.href = "/signup"}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 px-8"
              onClick={() => handlePurchase(pricingPlans[2])}
            >
              Get Monthly Pro
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Payment Dialog */}
      <EnhancedUPIPayment
        plan={selectedPlan}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default EnhancedPricingPage;