"use client";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { getQueryClient } from "./get-query-client";
import { useGlobalAuthStore } from "./stores/GlobalAuthStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      useGlobalAuthStore.getState().setUser(userData);
      queryClient.setQueryData(["user"], userData);
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='bottom-right' />
    </QueryClientProvider>
  );
}
