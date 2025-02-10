"use client";

import Topbar from "@/components/shared/topbar";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const setActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );

  let layouts = ["post", "group", "event"];

  return (
    <div className="h-screen">
      <div className="absolute bottom-2 left-1/2 transform rounded-full -translate-x-1/2 flex bg-white border-[1px] border-[#043A53] p-4  shadow-md">
        {layouts.map((layout, index) => (
          <div
            key={index}
            onClick={() => setActiveLayout(layout as any)}
            className={`capitalize cursor-pointer px-8 ${
              layout == activeLayout
                ? "bg-[#F2F5F6] text-[#043A53] py-2 rounded-full border-[0.2px] border-[#043A53]"
                : "py-2 rounded-full"
            }`}
          >
            {layout}
          </div>
        ))}
      </div>

      <Topbar />
      {/* <TopCommunityBar /> */}

      {children}
    </div>
  );
}
