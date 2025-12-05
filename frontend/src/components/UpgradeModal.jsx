"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const UpgradeModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <DialogTitle>Scan Limit Reached</DialogTitle>
          </div>
          <DialogDescription>
            Upgrade to continue using NeuroScan AI
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center">
          <p className="text-gray-700 mb-4">
            You've used all 3 free scans for this week. 
            To analyze more MRI images, please upgrade your plan.
          </p>
          <p className="text-sm text-gray-500">
            Visit our pricing page to choose a plan that fits your needs.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            onClick={() => window.location.href = "/pricing"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Plans & Pricing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;