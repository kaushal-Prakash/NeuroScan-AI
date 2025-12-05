"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaFileContract, FaMoneyBillWave } from "react-icons/fa";
import { useRouter } from "next/navigation";

const TermsOfService = () => {
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
              <FaFileContract className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Welcome to NeuroScan AI. These Terms of Service govern your use of our AI-powered chest X-ray analysis 
            service. Please read these terms carefully before using our service.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using NeuroScan AI&apos;s services, you agree to be bound by these Terms of Service and 
              our Privacy Policy. If you do not agree to these terms, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Service Description</h2>
            <p>
              NeuroScan AI provides an AI-based analysis service for chest X-ray images. Our service uses machine 
              learning algorithms to identify potential abnormalities in chest X-rays and generate preliminary 
              reports. This service is intended to assist healthcare professionals and should not be used as 
              a sole means of diagnosis.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
            <p>To use our service, you must:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Pricing and Payment</h2>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center mb-2">
                <FaMoneyBillWave className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium">Service Pricing</h3>
              </div>
              
              <h4 className="font-medium mt-4">Free Tier:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>3 free X-ray analyses per month</li>
                <li>Basic analysis report</li>
                <li>Standard processing time (up to 24 hours)</li>
              </ul>
              
              <h4 className="font-medium">Professional Tier - $9.99/month:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Unlimited X-ray analyses</li>
                <li>Detailed analysis reports with probability scores</li>
                <li>Priority processing (within 4 hours)</li>
                <li>Export functionality for reports</li>
                <li>Historical analysis tracking</li>
              </ul>
              
              <h4 className="font-medium">Enterprise Tier - Custom Pricing:</h4>
              <ul className="list-disc pl-6">
                <li>All Professional Tier features</li>
                <li>API access for integration with hospital systems</li>
                <li>Custom model training with your data</li>
                <li>Dedicated support and SLAs</li>
                <li>On-premise deployment options</li>
              </ul>
              
              <p className="mt-4 text-sm text-muted-foreground">
                All payments are processed securely. You can cancel your subscription at any time. 
                Medical institutions may be eligible for tax exemptions - please contact us for more information.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Medical Disclaimer</h2>
            <p className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              IMPORTANT: NeuroScan AI&apos;s services are intended to assist healthcare professionals and should 
              not be used as a sole means of diagnosis. Our AI-generated reports are preliminary assessments 
              and must be reviewed and verified by a qualified medical professional. We do not provide medical 
              advice, diagnosis, or treatment. Always seek the advice of qualified health providers with 
              questions you may have regarding medical conditions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of NeuroScan AI&apos;s service, including but not limited to 
              our machine learning models, algorithms, software, and documentation, are the exclusive property 
              of NeuroScan AI and are protected by international copyright, trademark, and other intellectual 
              property laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. User Content</h2>
            <p>
              By uploading X-ray images to our service, you grant NeuroScan AI a limited license to use, process, 
              and store these images solely for the purpose of providing our analysis service. We will not use 
              your medical images for any other purpose without your explicit consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, NeuroScan AI shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your access to or use of or inability to access or use the service</li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law provisions. Any legal action or proceeding arising under these 
              Terms will be brought exclusively in the federal or state courts located in San Francisco, California.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will provide notice of 
              significant changes through our website or by email. Your continued use of our service after 
              such changes constitutes your acceptance of the new Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@thoraxai.com
              <br />
              Address: 123 Medical Innovation Drive, Tech City, TC 12345
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;