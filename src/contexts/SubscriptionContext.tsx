import { createContext, useContext, useState, ReactNode } from "react";

type SubscriptionTier = "trial" | "starter" | "pro" | "custom";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  isPaid: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // Default to "trial" for free analysis users
  // Paid subscribers will have their tier set after payment
  const [tier, setTier] = useState<SubscriptionTier>("trial");

  const isPaid = tier !== "trial";

  return (
    <SubscriptionContext.Provider value={{ tier, setTier, isPaid }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
