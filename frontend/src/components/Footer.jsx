import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full">
      <Card className="rounded-none shadow-none border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md">
        <CardContent className="py-12 px-6 md:px-16">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Branding */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight">NeuroScan AI</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
                Brain Tumor Detection and Analysis Powered by AI to Aid Medical Professionals.
              </p>
            </div>

            {/* Navigation Links in a row */}
            <div className="flex gap-6 text-sm font-medium">
              <a
                href="/about"
                className="hover:text-primary transition-all hover:scale-105 text-foreground/80"
              >
                About
              </a>
              <a
                href="/contact"
                className="hover:text-primary transition-all hover:scale-105 text-foreground/80"
              >
                Contact
              </a>
              <a
                href="/blog"
                className="hover:text-primary transition-all hover:scale-105 text-foreground/80"
              >
                Blog
              </a>
            </div>
          </div>

          {/* Separator */}
          <Separator className="my-8 bg-border" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} NeuroScan AI. All rights reserved.</p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors border-border bg-background/50"
              >
                <a
                  href="https://github.com/kaushal-Prakash/NeuroScan-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors border-border bg-background/50"
              >
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors border-border bg-background/50"
              >
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Policies */}
            <div className="flex gap-5">
              <a href="/privacy" className="hover:underline text-foreground/80">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:underline text-foreground/80">
                Terms of Service
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;