import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type PlanTier = "free" | "starter" | "pro";

export interface ConnectedPlatform {
  id: string;
  name: string;
  connectedAt: Date;
}

export interface UserState {
  isAuthenticated: boolean;
  planTier: PlanTier;
  connectedPlatforms: ConnectedPlatform[];
  email?: string;
}

interface UserContextType {
  user: UserState;
  login: (email: string, planTier: PlanTier) => void;
  logout: () => void;
  upgradePlan: (tier: PlanTier) => void;
  connectPlatform: (platformId: string, platformName: string) => boolean;
  disconnectPlatform: (platformId: string) => void;
  canConnectMore: () => boolean;
  getConnectionLimit: () => number | null;
  getRemainingConnections: () => number | null;
}

const defaultUserState: UserState = {
  isAuthenticated: false,
  planTier: "free",
  connectedPlatforms: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUserState);

  const login = useCallback((email: string, planTier: PlanTier) => {
    setUser({
      isAuthenticated: true,
      planTier,
      connectedPlatforms: [],
      email,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(defaultUserState);
  }, []);

  const upgradePlan = useCallback((tier: PlanTier) => {
    setUser(prev => ({ ...prev, planTier: tier }));
  }, []);

  const getConnectionLimit = useCallback((): number | null => {
    switch (user.planTier) {
      case "starter":
        return 2;
      case "pro":
        return null;
      default:
        return 0;
    }
  }, [user.planTier]);

  const getRemainingConnections = useCallback((): number | null => {
    const limit = getConnectionLimit();
    if (limit === null) return null;
    return Math.max(0, limit - user.connectedPlatforms.length);
  }, [user.connectedPlatforms.length, getConnectionLimit]);

  const canConnectMore = useCallback((): boolean => {
    if (user.planTier === "free") return false;
    if (user.planTier === "pro") return true;
    return user.connectedPlatforms.length < 2;
  }, [user.planTier, user.connectedPlatforms.length]);

  const connectPlatform = useCallback((platformId: string, platformName: string): boolean => {
    if (!canConnectMore()) return false;
    
    const alreadyConnected = user.connectedPlatforms.some(p => p.id === platformId);
    if (alreadyConnected) return false;

    setUser(prev => ({
      ...prev,
      connectedPlatforms: [
        ...prev.connectedPlatforms,
        { id: platformId, name: platformName, connectedAt: new Date() }
      ]
    }));
    return true;
  }, [canConnectMore, user.connectedPlatforms]);

  const disconnectPlatform = useCallback((platformId: string) => {
    setUser(prev => ({
      ...prev,
      connectedPlatforms: prev.connectedPlatforms.filter(p => p.id !== platformId)
    }));
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      upgradePlan,
      connectPlatform,
      disconnectPlatform,
      canConnectMore,
      getConnectionLimit,
      getRemainingConnections,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
