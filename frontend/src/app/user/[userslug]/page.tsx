"use client";

import { PersonalEventsSection } from "@/components/pages/personal-events-section";
import { PersonalFeedPosts } from "@/components/pages/personal-feed-posts";
import { PersonalGroupsSection } from "@/components/pages/personal-groups-section";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function UserPage() {
  const activeTab = useGlobalLayoutStore((state) => state.activeProfileTab);

  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-180px)] hide-scrollbar overflow-hidden">
        {activeTab == "created" && <PersonalFeedPosts />}
        {activeTab == "joined" && <PersonalGroupsSection />}
        {activeTab == "events" && <PersonalEventsSection />}
      </div>

      <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
        <div className="bg-white px-4 rounded-xl w-[350px]"></div>
      </div>
    </div>
  );
}
