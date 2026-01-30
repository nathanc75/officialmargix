import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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
  userId?: string;
  displayName?: string;
}

interface UserContextType {
  user: UserState;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string; business_name?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser({
            isAuthenticated: true,
            planTier: "free", // Default, can be updated from profile
            connectedPlatforms: [],
            email: currentSession.user.email,
            userId: currentSession.user.id,
            displayName: currentSession.user.user_metadata?.full_name,
          });
        } else {
          setUser(defaultUserState);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (existingSession?.user) {
        setSession(existingSession);
        setUser({
          isAuthenticated: true,
          planTier: "free",
          connectedPlatforms: [],
          email: existingSession.user.email,
          userId: existingSession.user.id,
          displayName: existingSession.user.user_metadata?.full_name,
        });
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string; business_name?: string }
  ): Promise<{ error: Error | null }> => {
    // TEMP: Mock signup for testing - bypasses Supabase
    setUser({
      isAuthenticated: true,
      planTier: "free",
      connectedPlatforms: [],
      email,
      userId: "mock-user-id",
      displayName: metadata?.full_name,
    });
    setIsLoading(false);
    return { error: null };
    
    /* REAL SUPABASE AUTH - uncomment when ready
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: metadata,
      },
    });
    return { error };
    */
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: Error | null }> => {
    // TEMP: Mock signin for testing - bypasses Supabase
    setUser({
      isAuthenticated: true,
      planTier: "free",
      connectedPlatforms: [],
      email,
      userId: "mock-user-id",
    });
    setIsLoading(false);
    return { error: null };
    
    /* REAL SUPABASE AUTH - uncomment when ready
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
    */
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(defaultUserState);
    setSession(null);
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
      session,
      isLoading,
      signUp,
      signIn,
      signOut,
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
