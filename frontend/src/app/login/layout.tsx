"use client";

import GlobalLoader from "@/components/globalloader";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useLayoutEffect } from "react";

export default function JoinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useGlobalAuthStore((state) => state.user);

  useLayoutEffect(() => {
    if (user) {
      setTimeout(() => {
        window.location.href = "/community/";
      }, 1000);
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <section className="min-h-screen z-[1000] bg-white w-screen overflow-hidden absolute top-0 left-0 flex justify-center items-center">
          <GlobalLoader />
        </section>
      ) : (
        <section className="min-h-screen">{children}</section>
      )}
    </div>
  );
}
