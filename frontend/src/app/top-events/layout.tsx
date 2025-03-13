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
      <div className="sticky top-[0px] z-50 bg-white py-2">
        <Topbar />
        <TopCommunityBar />
      </div>

      {children}
    </div>
  );
}
