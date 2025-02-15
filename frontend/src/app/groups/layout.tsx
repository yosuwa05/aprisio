"use client";

import { TopCommunityBar } from "@/components/community/top-community-bar";
import Topbar from "@/components/shared/topbar";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Topbar />
      <TopCommunityBar />

      {children}
    </div>
  );
}
