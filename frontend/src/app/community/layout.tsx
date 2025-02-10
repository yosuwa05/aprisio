"use client";

import Topbar from "@/components/shared/topbar";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Topbar />
      {children}
    </div>
  );
}
