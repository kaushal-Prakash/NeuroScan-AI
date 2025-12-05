"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export function OTPDialog({
  open,
  onOpenChange,
  email,
  onVerificationSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  const sendOTP = async () => {
    setSending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setVerificationId(res.data.verificationId);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP", { description: res.data.message });
      }
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          email,
          otp,
          verificationId,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("OTP verified successfully");
        onVerificationSuccess();
        onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to {email}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            
            <Button
              variant="outline"
              onClick={sendOTP}
              disabled={sending}
              className="w-full"
            >
              {sending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}