"use client";

import DockMenu from "@/components/dockmenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className='md:hidden'>
        <DockMenu />
      </div>
      {children}
    </div>
  );
}
