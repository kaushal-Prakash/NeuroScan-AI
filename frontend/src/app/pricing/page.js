"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaCheckCircle, FaArrowRight, FaEye, FaSync, FaChartLine, FaRocket } from 'react-icons/fa';

// UPI QR Payment Component (simplified version)
const UPIQRPayment = ({ amount, planName, isOpen, onClose, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [screenshot, setScreenshot] = useState(null);

  const generateUPIString = () => {
    const params = new URLSearchParams({
      pa: "kaushalprakash1289@oksbi",
      pn: "Thorax AI",
      am: amount,
      cu: 'INR',
      tn: `Payment for ${planName}`,
      tid: `TXN${Date.now()}`,
      tr: `ORDER${Date.now()}`
    });
    
    return `upi://pay?${params.toString()}`;
  };

  const handlePaymentDone = () => {
    setPaymentStatus('verification');
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const screenshotData = e.target.result;
        setScreenshot(screenshotData);
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(screenshotData);
          onClose();
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setScreenshot(null);
  };

  const upiString = generateUPIString();
  const numericAmount = parseFloat(amount.replace('$', ''));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Pay ${numericAmount} for {planName} via UPI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {paymentStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mx-auto w-fit">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`}
                  alt="UPI QR Code"
                  className="w-48 h-48"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Scan this QR code with any UPI app to pay ${numericAmount}
                </p>
                <p className="text-xs text-gray-500">
                  UPI ID: thoraxai@upi
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handlePaymentDone} className="flex-1">
                  I&apos;ve Paid
                </Button>
              </div>
            </motion.div>
          )}

          {paymentStatus === 'verification' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Verification</h3>
                <p className="text-yellow-700 text-sm">
                  Please upload a screenshot of your payment confirmation
                </p>
              </div>

              <input
                type="file"
                onChange={handleScreenshotUpload}
                accept="image/*"
                className="hidden"
                id="screenshot-upload"
              />

              <Button 
                onClick={() => document.getElementById('screenshot-upload').click()}
                className="w-full"
              >
                Upload Screenshot
              </Button>

              <Button variant="outline" onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </motion.div>
          )}

          {paymentStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-700 mb-2">Thank You!</h3>
                <p className="text-green-600">Payment received successfully</p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Animation variants
const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Pricing Plans Data
const pricingPlans = [
  {
    title: "One-Time Usage",
    price: "$9.99",
    description: "Access Thorax AI for a single analysis/report.",
    features: [
      "Single analysis report",
      "Basic insights",
      "PDF export",
      "Email support",
    ],
    popular: false,
    value: false,
    icon: <FaEye className="h-6 w-6" />,
  },
  {
    title: "Weekly Access",
    price: "$19.99",
    period: "/ week",
    description: "Unlimited queries for 7 days. Perfect for short-term projects.",
    features: [
      "Unlimited analyses",
      "Detailed reports",
      "Priority processing",
      "Email support",
    ],
    popular: false,
    value: false,
    icon: <FaSync className="h-6 w-6" />,
  },
  {
    title: "Monthly Access",
    price: "$49.99",
    period: "/ month",
    description: "Unlimited usage + priority support. Best for professionals & startups.",
    features: [
      "Unlimited analyses",
      "Advanced reports",
      "4-hour processing",
      "Priority support",
    ],
    popular: true,
    value: false,
    icon: <FaChartLine className="h-6 w-6" />,
  },
  {
    title: "Yearly Unlimited",
    price: "$399.99",
    period: "/ year",
    description: "Full access, unlimited usage, premium support, and custom model options.",
    features: [
      "All features",
      "Custom model options",
      "1-hour processing",
      "24/7 premium support",
      "API access",
    ],
    popular: false,
    value: true,
    icon: <FaRocket className="h-6 w-6" />,
  },
];

// Main Pricing Page Component
const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePurchaseClick = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (screenshot) => {
    console.log('Payment successful for plan:', selectedPlan?.title);
    console.log('Screenshot:', screenshot);
    // Here you would typically send the data to your backend
  };

  const handleClosePayment = () => {
    setShowPaymentDialog(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing options designed to help you get the most out of Thorax AI. 
            Start with a one-time analysis or unlock unlimited access.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card
                className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${
                  plan.popular ? "border-primary ring-2 ring-primary/20 shadow-lg" : ""
                } ${plan.value ? "border-2 border-amber-500 shadow-lg" : ""}`}
              >
                <CardHeader
                  className={`pb-4 ${plan.popular ? "bg-primary/5" : ""} ${
                    plan.value ? "bg-amber-500/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {plan.icon}
                        {plan.title}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {plan.popular && (
                      <Badge variant="default" className="ml-0.5">
                        Most Popular
                      </Badge>
                    )}
                    {plan.value && (
                      <Badge
                        variant="outline"
                        className="ml-0.5 bg-amber-500/10 text-amber-700 border-amber-500/20"
                      >
                        Best Value
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-6">
                  <div className="text-3xl font-bold mb-4">
                    {plan.price}
                    {plan.period && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handlePurchaseClick(plan)}
                  >
                    Get Started <FaArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Dialog */}
        {selectedPlan && (
          <UPIQRPayment
            amount={selectedPlan.price}
            planName={selectedPlan.title}
            isOpen={showPaymentDialog}
            onClose={handleClosePayment}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold mb-2">How does the payment process work?</h3>
              <p className="text-gray-600 text-sm">
                After selecting a plan, you&apos;ll see a UPI QR code. Scan it with any UPI app to complete your payment, then upload a screenshot for verification.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade your plan at any time. The remaining value of your current plan will be applied to the new one.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;