"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, ReactNode, useContext } from "react";

type AppContextType = {
  user: ReturnType<typeof useUser>["user"];
  isSignedIn: ReturnType<typeof useUser>["isSignedIn"];
  isLoaded: ReturnType<typeof useUser>["isLoaded"];
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const value: AppContextType = { user, isSignedIn, isLoaded };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};