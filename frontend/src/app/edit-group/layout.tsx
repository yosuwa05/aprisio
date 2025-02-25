"use client";

import Topbar from "@/components/shared/topbar";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=''>
      <div className='sticky top-[0px] z-50 bg-white py-2'>
        <Topbar />
      </div>
      {children}
    </div>
  );
}
