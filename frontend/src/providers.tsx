"use client";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { getQueryClient } from "./get-query-client";
import { _axios } from "./lib/axios-instance";
import { useGlobalAuthStore } from "./stores/GlobalAuthStore";
import { WS_BASE_URL } from "./lib/config";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const user = useGlobalAuthStore((state) => state.user);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE_URL}/api/ws`);

    ws.onopen = () => {
      console.log("WebSocket connection opened frontned ");
      ws.send(JSON.stringify({ userId: user?.id }));
    };

    ws.onmessage = (event) => {
      console.log("Message received from server:", event.data);
    };
  }, [user?.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/lib/firebase").then(
        ({ onMessageListener, requestForToken }) => {
          if (user) {
            requestForToken().then(async (token) => {
              if (token) {
                await _axios.post("/myprofile/updateFcm", { fcmToken: token });
              }
            });
          }

          onMessageListener().then((payload: any) => {
            if (Navigator) {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(payload.data.title, {
                  body: payload.data.message,
                  icon: "/logo.png",
                });
              });
            } else {
              console.log("Notification not supported");
            }
          });
        }
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='top-center' />
    </QueryClientProvider>
  );
}
