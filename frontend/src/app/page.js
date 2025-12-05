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

  // Pricing data
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
      description:
        "Unlimited queries for 7 days. Perfect for short-term projects.",
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
      description:
        "Unlimited usage + priority support. Best for professionals & startups.",
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
      description:
        "Full access, unlimited usage, premium support, and custom model options.",
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

  // Testimonials
  const testimonials = [
    {
      quote: "Thorax AI cut our data processing time by 80%.",
      author: "Business Analyst",
      company: "Healthcare Analytics Inc.",
    },
    {
      quote: "We gained real-time insights that saved lives.",
      author: "CTO",
      company: "MedTech Startup",
    },
    {
      quote: "A flexible AI system we can trust for our research.",
      author: "Lead Researcher",
      company: "University Medical Center",
    },
  ];

  // Features
  const features = [
    {
      title: "Real-time AI Analysis",
      description: "Get instant insights from our advanced ML models",
      icon: <FaBrain className="h-8 w-8" />,
    },
    {
      title: "Data Visualization",
      description: "Interactive dashboards for comprehensive analysis",
      icon: <FaChartLine className="h-8 w-8" />,
    },
    {
      title: "Scalable API",
      description: "Integrate easily with your existing systems",
      icon: <FaPlug className="h-8 w-8" />,
    },
    {
      title: "Custom Deployment",
      description: "Tailor models to your specific needs",
      icon: <FaCogs className="h-8 w-8" />,
    },
    {
      title: "Role-Based Access",
      description: "Control access with precision and security",
      icon: <FaUserLock className="h-8 w-8" />,
    },
    {
      title: "Cross-Platform",
      description: "Access from any device, anywhere",
      icon: <FaLaptop className="h-8 w-8" />,
    },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              AI-Powered Insights.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-World Impact.
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Thorax AI transforms data into actionable intelligence, enabling
              businesses, researchers, and innovators to solve critical
              challenges with speed and precision.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="gap-2"
                onClick={() => router.push("/signup")}
              >
                <FaRocket className="h-5 w-5" />
                Start Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => router.push("/demo")}
              >
                <FaEye className="h-5 w-5" />
                See How It Works
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Thorax AI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with practical applications to
              deliver real value.
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
              className="text-center p-6 rounded-lg bg-muted/50"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 text-primary">
                <FaBrain className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smarter Decisions</h3>
              <p className="text-muted-foreground">
                Leverage cutting-edge ML models trained for real-world impact.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-muted/50"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 text-primary">
                <FaRocket className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blazing Fast</h3>
              <p className="text-muted-foreground">
                Powered by FastAPI + scalable MERN frontend.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-muted/50"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 text-primary">
                <FaShieldAlt className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure by Design</h3>
              <p className="text-muted-foreground">
                Authentication & RBAC to safeguard your data.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-muted/50"
              variants={fadeIn}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 text-primary">
                <FaChartLine className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Actionable Insights
              </h3>
              <p className="text-muted-foreground">
                Interactive dashboards and reports to guide decision-making.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform data into intelligence.
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
                className="p-6 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you. Pay as you grow.
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
                  className={`h-full flex flex-col overflow-hidden ${
                    plan.popular ? "border-primary ring-2 ring-primary/20" : ""
                  } ${plan.value ? "border-2 border-amber-500" : ""}`}
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
                          Best Value{" "}
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
                    <Button className="w-full gap-2">
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
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by professionals across industries.
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
                className="bg-background p-6 rounded-lg border shadow-sm"
                variants={fadeIn}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Unlock the Power of AI?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your journey today – whether for a one-time analysis or a
              long-term partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <FaRocket className="h-5 w-5" />
                Get Started
              </Button>
              <Button
                onClick={() => router.push("/about-us")}
                size="lg"
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white hover:text-primary gap-2"
              >
                Learn More <FaArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
