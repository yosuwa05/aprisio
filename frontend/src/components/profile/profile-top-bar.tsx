"use client";

import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
type Topic = {
  _id: string;
  topicName: string;
};

export function ProfileTopBar() {
  const activeTabs = [
    {
      slug: "created",
      name: "Created Posts",
    },
    {
      slug: "joined",
      name: "Groups Joined",
    },
    {
      slug: "events",
      name: "Events Created",
    },
  ];

  const activeTab = useGlobalLayoutStore((state) => state.activeProfileTab);
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveProfileTab
  );
  return (
    <div className="bg-[#F2F5F6] h-[50px] flex items-center overflow-hidden">
      <div className="flex gap-4 items-center ml-4 md:ml-12 w-full">
        <div className="mr-20 flex gap-6 w-full overflow-hidden">
          {activeTabs.map(
            (topic: { slug: string; name: string }, index: number) => (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(topic.slug as any);
                }}
                className={`text-sm md:text-lg font-bold select-none cursor-pointer text-nowrap ${
                  topic.slug == activeTab
                    ? "text-contrasttext font-bold"
                    : "text-fadedtext"
                }`}
              >
                {topic.name}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
