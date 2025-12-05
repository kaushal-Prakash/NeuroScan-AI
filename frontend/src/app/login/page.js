"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { OTPDialog } from "@/components/OTPDialog";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        // Check if OTP verification is required
        if (res.data.requiresOTP) {
          setShowOTPDialog(true);
        } else {
          toast.success("Login successful");
          router.push("/dashboard");
        }
      } else {
        toast.error("Login failed", { description: res.data.message });
      }
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.requiresOTP) {
        setShowOTPDialog(true);
      } else {
        toast.error("Something went wrong", {
          description: error.response?.data?.message || error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setShowForgotPasswordDialog(true);
  };

  const handleOTPVerificationSuccess = () => {
    toast.success("Login successful");
    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              Login to <Badge variant="outline">Thorax AI</Badge>
            </CardTitle>
            <CardDescription>
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={handleForgotPasswordClick}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={handleLogin} 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <FaGoogle/> Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>

      <OTPDialog
        open={showOTPDialog}
        onOpenChange={setShowOTPDialog}
        email={email}
        onVerificationSuccess={handleOTPVerificationSuccess}
      />

      <ForgotPasswordDialog
        open={showForgotPasswordDialog}
        onOpenChange={setShowForgotPasswordDialog}
        email={email}
      />
    </>
  );
}