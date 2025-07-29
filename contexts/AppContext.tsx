"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, ReactNode, useContext } from "react";

type AppContextType = {
  user: ReturnType<typeof useUser>["user"];
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
  const { user } = useUser();
  const value: AppContextType = { user };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};