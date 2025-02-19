"use client";

import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export function MyProfileTopBar() {
  const activeTabs = [
    {
      slug: "commented-posts",
      name: "Commented Posts",
    },
    {
      slug: "created-posts",
      name: "Created Posts",
    },
    {
      slug: "favourite-posts",
      name: "Favourite Posts",
    },
    {
      slug: "organised-events",
      name: "Organised Events",
    },
    {
      slug: "events-participated",
      name: "Events Participated",
    },
    {
      slug: "created-groups",
      name: "Created Groups",
    },
    {
      slug: "joined-groups",
      name: "Joined Groups",
    },
    {
      slug: "settings",
      name: "Settings",
    },
  ];

  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  return (
    <div className='bg-[#F2F5F6] h-[50px] flex items-center overflow-hidden'>
      <div className='flex gap-4 items-center ml-4 md:ml-12 w-full'>
        <div className='mr-20 flex gap-6 w-full overflow-hidden'>
          {activeTabs.map(
            (topic: { slug: string; name: string }, index: number) => (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(topic.slug as any);
                }}
                className={`text-sm md:text-lg  select-none cursor-pointer text-nowrap ${
                  topic.slug == activeTab
                    ? "text-contrasttext font-bold"
                    : "text-fadedtext"
                }`}>
                {topic.name}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
