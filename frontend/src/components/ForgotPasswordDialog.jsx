"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function ForgotPasswordDialog({ open, onOpenChange, email }) {
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP, 3: reset password

  const router = useRouter();

  // Sync with parent email when dialog opens
  useEffect(() => {
    if (open && email) {
      setResetEmail(email);
    }
  }, [open, email]);

  const handleSendOTP = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/create-otp`,
        { email: resetEmail },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error("Failed to send OTP", { description: res.data.message });
      }
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        { email: resetEmail, otp },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("OTP verified successfully");
        setStep(3); // go to reset password step
      } else {
        toast.error("OTP verification failed", { description: res.data.message });
      }
    } catch (error) {
      toast.error("OTP verification failed", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        { email: resetEmail, newPassword },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Password reset successfully. Please login.");
        onOpenChange(false);
        router.push("/login");
      } else {
        toast.error("Password reset failed", { description: res.data.message });
      }
    } catch (error) {
      toast.error("Password reset failed", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Enter your email address and we'll send you an OTP to reset your password."
              : step === 2
              ? "Enter the 6-digit OTP sent to your email address."
              : "Enter your new password below."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 1 && (
            <div className="grid gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="m@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={sendingOtp}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {resetEmail}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {step === 1 && (
            <>
              <Button
                onClick={handleSendOTP}
                disabled={sendingOtp || !resetEmail}
                className="w-full"
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sendingOtp}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToEmail}
                disabled={loading}
                className="w-full"
              >
                Back to Email
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Button
                onClick={handleResetPassword}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
