// @ts-nocheck
"use client";
import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext<{
  theme: "light";
  toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => {} });

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always use 'light' theme
  useEffect(() => {
    document.body.style.background = "#fff";
    document.body.style.color = "#18181b";
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
} 