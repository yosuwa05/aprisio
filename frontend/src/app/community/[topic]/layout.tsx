"use client";

import DockMenu from "@/components/dockmenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DockMenu />
      {children}
    </div>
  );
}
