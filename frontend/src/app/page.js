"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Pricing data for NeuroScan AI
  const pricingPlans = [
    {
      title: "Single Scan",
      price: "₹49.99",
      description: "Get one comprehensive brain MRI analysis report.",
      features: [
        "One-time MRI analysis",
        "Detailed tumor classification",
        "PDF medical report",
        "Basic visualization",
        "Email support",
      ],
      popular: false,
      value: false,
      icon: <FaFileMedical className="h-6 w-6" />,
    },
    {
      title: "Weekly Access",
      price: "₹149.99",
      period: "/ week",
      description: "Unlimited scans for 7 days. Ideal for patient monitoring.",
      features: [
        "Unlimited MRI analyses",
        "Advanced tumor detection",
        "Comparative reports",
        "Priority processing",
        "Email & chat support",
      ],
      popular: false,
      value: false,
      icon: <FaSync className="h-6 w-6" />,
    },
    {
      title: "Monthly Pro",
      price: "₹399.99",
      period: "/ month",
      description: "For medical professionals & small clinics. Best value.",
      features: [
        "Unlimited scans",
        "Multi-patient management",
        "Advanced analytics",
        "2-hour processing",
        "Priority phone support",
        "HIPAA compliant",
      ],
      popular: true,
      value: false,
      icon: <FaUserMd className="h-6 w-6" />,
    },
    {
      title: "Enterprise",
      price: "₹2999.99",
      period: "/ year",
      description: "For hospitals & research institutions. Full platform access.",
      features: [
        "All Pro features",
        "Custom AI models",
        "API integration",
        "1-hour processing",
        "24/7 dedicated support",
        "Bulk processing",
        "Research collaboration",
      ],
      popular: false,
      value: true,
      icon: <FaHospital className="h-6 w-6" />,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "NeuroScan AI detected a pituitary tumor that was missed in initial screening. Early detection saved my patient's vision.",
      author: "Dr. Sarah Chen",
      company: "Neurology Specialist, Mayo Clinic",
      rating: 5,
    },
    {
      quote: "The accuracy and speed of their AI model is remarkable. We've reduced diagnosis time by 70% in our radiology department.",
      author: "Dr. Michael Rodriguez",
      company: "Chief Radiologist, Stanford Medical",
      rating: 5,
    },
    {
      quote: "As a research institution, we appreciate the detailed probability distributions. It's transformed our tumor classification studies.",
      author: "Prof. James Wilson",
      company: "Neuroscience Research Director, MIT",
      rating: 5,
    },
  ];

  // Features specific to NeuroScan AI
  const features = [
    {
      title: "Advanced AI Detection",
      description: "94% accurate CNN models for pituitary, glioma, and meningioma tumors",
      icon: <FaBrain className="h-8 w-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Real-time Analysis",
      description: "Get results in minutes with our optimized processing pipeline",
      icon: <FaRocket className="h-8 w-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Medical Grade Security",
      description: "HIPAA compliant data protection & encrypted patient records",
      icon: <FaShieldAlt className="h-8 w-8" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Detailed Reports",
      description: "Comprehensive PDF reports with probability distributions",
      icon: <FaFileMedical className="h-8 w-8" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Multi-format Support",
      description: "Process DICOM, JPEG, PNG, and TIFF MRI scans",
      icon: <FaCogs className="h-8 w-8" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Research Integration",
      description: "API access for research institutions and hospitals",
      icon: <FaMicroscope className="h-8 w-8" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  // Tumor types we detect
  const tumorTypes = [
    {
      name: "Pituitary Tumors",
      description: "Benign tumors of the pituitary gland affecting hormone production",
      detectionRate: "96% accuracy",
      icon: <FaBrain className="h-6 w-6" />,
    },
    {
      name: "Glioma Tumors",
      description: "Primary brain tumors arising from glial cells",
      detectionRate: "92% accuracy",
      icon: <FaHeartbeat className="h-6 w-6" />,
    },
    {
      name: "Meningioma Tumors",
      description: "Tumors arising from the meninges, usually benign",
      detectionRate: "95% accuracy",
      icon: <FaStethoscope className="h-6 w-6" />,
    },
    {
      name: "No Tumor",
      description: "Clear scans confirmed with high confidence",
      detectionRate: "98% accuracy",
      icon: <FaCheckCircle className="h-6 w-6" />,
    },
  ];

  // Stats
  const stats = [
    { number: "50,000+", label: "Scans Processed" },
    { number: "94%", label: "Detection Accuracy" },
    { number: "2,000+", label: "Medical Professionals" },
    { number: "150+", label: "Hospitals Worldwide" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-4">
              <FaRobot className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Brain Tumor Detection</span>
            </div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Revolutionizing Brain Tumor{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Detection with AI
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              NeuroScan AI uses advanced deep learning to detect and classify brain tumors from MRI scans with 94% accuracy. Early detection saves lives.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/services")}
              >
                <FaBrain className="h-5 w-5" />
                Try Free Analysis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => router.push("/demo")}
              >
                <FaEye className="h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeIn}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tumor Types Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Detect Multiple Tumor Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI model is trained to identify various brain tumor types with high precision
            </p>
          </motion.div>

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
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tumor.name === "No Tumor" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} mb-4`}>
                  {tumor.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tumor.name}</h3>
                <p className="text-gray-600 mb-3">{tumor.description}</p>
                <Badge variant="outline" className={`${tumor.name === "No Tumor" ? "border-green-200 text-green-700 bg-green-50" : "border-blue-200 text-blue-700 bg-blue-50"}`}>
                  {tumor.detectionRate}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose NeuroScan AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combining medical expertise with cutting-edge AI technology for better patient outcomes
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-white border"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 text-blue-600">
                <FaBrain className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
              <p className="text-gray-600">
                94% accuracy in tumor detection validated by medical professionals
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-white border"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 text-blue-600">
                <FaRocket className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
              <p className="text-gray-600">
                Get detailed analysis reports in minutes, not days
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-white border"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 text-blue-600">
                <FaShieldAlt className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                HIPAA compliant with encrypted data and secure patient records
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-white border"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 text-blue-600">
                <FaUserMd className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doctor Verified</h3>
              <p className="text-gray-600">
                All models validated by board-certified neurologists
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for accurate brain tumor detection and analysis
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your MRI analyzed in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload MRI</h3>
              <p className="text-gray-600">
                Upload your brain MRI scan in DICOM, JPEG, PNG, or TIFF format
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our deep learning model analyzes the scan for tumors with 94% accuracy
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Report</h3>
              <p className="text-gray-600">
                Receive detailed PDF report with tumor classification and probabilities
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start with a free analysis today.
            </p>
          </motion.div>

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
                  className={`h-full flex flex-col overflow-hidden border-2 transition-all duration-300 hover:border-blue-300 ${
                    plan.popular ? "border-blue-500 ring-2 ring-blue-200 shadow-lg" : "border-gray-200"
                  } ${plan.value ? "border-amber-500 ring-2 ring-amber-200" : ""}`}
                >
                  <CardHeader
                    className={`pb-4 ${plan.popular ? "bg-gradient-to-r from-blue-50 to-blue-100" : ""} ${
                      plan.value ? "bg-gradient-to-r from-amber-50 to-amber-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${plan.popular ? "bg-blue-100 text-blue-600" : plan.value ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}>
                          {plan.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{plan.title}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                      </div>
                      {plan.popular && (
                        <Badge className="bg-blue-600 hover:bg-blue-700 ml-0.5">
                          Most Popular
                        </Badge>
                      )}
                      {plan.value && (
                        <Badge className="bg-amber-600 hover:bg-amber-700 ml-0.5">
                          Best Value
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="text-3xl font-bold mb-4">
                      {plan.price}
                      {plan.period && (
                        <span className="text-sm font-normal text-gray-500">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full gap-2 ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : plan.value ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                      onClick={() => router.push("/pricing")}
                    >
                      Get Started <FaArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Medical Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what doctors and researchers are saying about NeuroScan AI
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
              <FaBrain className="h-4 w-4" />
              <span className="text-sm font-medium">Early Detection Saves Lives</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Brain Tumor Detection?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start with a free analysis today and experience the power of AI in medical imaging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2 bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => router.push("/services")}
              >
                <FaBrain className="h-5 w-5" />
                Try Free Analysis
              </Button>
              <Button
                onClick={() => router.push("/contact")}
                size="lg"
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white/10 gap-2"
              >
                Contact Sales <FaArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-6">
              No credit card required for free analysis • HIPAA compliant • 256-bit encryption
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}