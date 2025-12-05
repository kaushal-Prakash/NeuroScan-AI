// components/UpgradeModal.jsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Shield, Zap, Globe, Lock } from "lucide-react";
import axios from "axios";

const UpgradeModal = ({ open, onClose, onUpgrade }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/plans`
      );
      if (response.data.success) {
        setPlans(response.data.plans);
        // Select the first paid plan by default
        const paidPlan = response.data.plans.find(p => p.price > 0);
        if (paidPlan) {
          setSelectedPlan(paidPlan);
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/upgrade`,
        {
          subscriptionType: selectedPlan.period,
          paymentMethod: "card" // For demo
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        onUpgrade(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (period) => {
    switch(period) {
      case "single": return <Zap className="h-5 w-5" />;
      case "weekly": return <Globe className="h-5 w-5" />;
      case "monthly": return <Crown className="h-5 w-5" />;
      case "yearly": return <Shield className="h-5 w-5" />;
      case "enterprise": return <Lock className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your needs. Upgrade to unlock more MRI scans.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedPlan?.id === plan.id
                  ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  plan.price > 0 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {getPlanIcon(plan.period)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.period !== "single" && plan.period !== "lifetime" && (
                      <span className="text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Scans:</span>
                  <Badge variant={plan.scansLimit === -1 ? "default" : "outline"}>
                    {plan.scansLimit === -1 ? "Unlimited" : `${plan.scansLimit} scans`}
                  </Badge>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features?.map((feature, idx) => (
                  feature.included && (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature.name}</span>
                    </li>
                  )
                ))}
              </ul>

              <Button
                className="w-full"
                variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                disabled={plan.price === 0}
              >
                {plan.price === 0 ? "Current Plan" : "Select Plan"}
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={!selectedPlan || selectedPlan.price === 0 || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {isLoading ? "Processing..." : `Upgrade to ${selectedPlan?.name}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;