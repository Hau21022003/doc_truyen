"use client";

import { ReactQueryProvider } from "./react-query-provider";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "next-themes";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
