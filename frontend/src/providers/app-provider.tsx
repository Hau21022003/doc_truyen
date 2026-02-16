"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-provider";
import { ConfirmProvider } from "./confirm-provider";
import { ReactQueryProvider } from "./react-query-provider";

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
          <ConfirmProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ConfirmProvider>
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
