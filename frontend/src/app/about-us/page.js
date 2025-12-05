"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Code2,
  Cpu,
  Database,
  Terminal,
  GitBranch,
  Brain,
  Server,
  Shield,
  Palette,
  CpuIcon,
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

  // Features data
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-driven insights",
      description: "Harnesses advanced ML models for decision making"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "FastAPI backend",
      description: "High-performance, asynchronous, and production-ready API layer"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "MERN stack frontend",
      description: "Responsive, real-time, and user-friendly web interface"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Authentication & RBAC",
      description: "Role-based access for secure usage"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data visualization",
      description: "Interactive charts and reports for insights"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Scalable architecture",
      description: "Designed to grow with your needs"
    }
  ];

  // Tech stack data
  const techStack = [
    {
      category: "Frontend",
      icon: <Code2 className="w-5 h-5" />,
      items: ["Next.js", "Tailwind CSS", "React", "TypeScript"]
    },
    {
      category: "Backend",
      icon: <CpuIcon className="w-5 h-5" />,
      items: ["FastAPI", "Python", "Node.js", "RESTful APIs"]
    },
    {
      category: "Database",
      icon: <Database className="w-5 h-5" />,
      items: ["MongoDB", "Mongoose ORM", "NoSQL", "Data Modeling"]
    }
  ];

  // System requirements
  const systemRequirements = {
    hardware: [
      "Processor: Intel i3 or higher",
      "Memory: 8 GB RAM minimum",
      "Storage: 20 GB free disk space",
      "GPU (optional, for AI acceleration)"
    ],
    software: [
      "Node.js (v18 or later)",
      "Python (3.10 or later)",
      "MongoDB (v6 or later)",
      "Modern web browser"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div 
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Thorax AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An intelligent system designed to leverage <span className="font-semibold text-primary">AI-powered analysis</span> for solving critical real-world challenges. 
            Built with a modern <span className="font-semibold text-primary">MERN stack frontend</span> and a <span className="font-semibold text-primary">FastAPI backend</span>, 
            Thorax AI is scalable, modular, and production-ready.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Key Features
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
                whileHover={{ y: -5 }}
              >
                <Card className="h-full shadow-md hover:shadow-lg transition-shadow border-0 bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
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
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-md border-0 bg-background/70 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      {tech.icon}
                      {tech.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tech.items.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* System Requirements Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              System Requirements
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-md border-0 bg-background/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Hardware
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {systemRequirements.hardware.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-md border-0 bg-background/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Software
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {systemRequirements.software.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
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
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Get Started
            </span>
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-md border-0 bg-background/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Clone the Repository
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>
{`git clone https://github.com/kaushal-Prakash/thorax-ai
cd thorax-ai`}
                    </code>
                  </pre>
                </div>
                <Button asChild className="gap-2">
                  <a
                    href="https://github.com/kaushal-Prakash/thorax-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitBranch className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}