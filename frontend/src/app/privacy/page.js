"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { GiArmorUpgrade } from "react-icons/gi";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <FaArrowLeft className="mr-2" /> Back
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <GiArmorUpgrade className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            At NeuroScan AI, we are committed to protecting your privacy and ensuring the security of your personal 
            and medical information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
            your information when you use our AI-powered chest X-ray analysis service.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2">Personal Information:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Name, email address, and contact details</li>
              <li>Account credentials and payment information</li>
              <li>Demographic information such as age and gender</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Medical Information:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Chest X-ray images and associated metadata</li>
              <li>AI-generated analysis reports</li>
              <li>Radiologist notes and annotations (if applicable)</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Technical Information:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address, browser type, and device information</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, maintain, and improve our AI analysis services</li>
              <li>To process transactions and send related information</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To develop and improve our machine learning algorithms</li>
              <li>To send technical notices, updates, and security alerts</li>
              <li>To monitor and analyze trends, usage, and activities</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure storage of medical images and reports</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
            <p>
              We retain your personal and medical information only for as long as necessary to fulfill the purposes 
              for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting 
              requirements. Medical images and reports are typically retained for a minimum of 7 years as required by 
              medical record retention laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability for your information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@thoraxai.com
              <br />
              Address: 123 Medical Innovation Drive, Tech City, TC 12345
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;