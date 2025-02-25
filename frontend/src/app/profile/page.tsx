"use client";

import { ChatBase } from "@/components/chat/chat-base";
import { EditProfile } from "@/components/my-profile/my-profile-edit";
import { MyProfileCreatedGroups } from "@/components/my-profile/tabsection/my-profile-created-groups";
import { MyProfileLikedPosts } from "@/components/my-profile/tabsection/my-profile-favourite-posts";
import { MyProfileJoinedGroups } from "@/components/my-profile/tabsection/my-profile-joined-groups";
import { MyProfileOrganisedEvents } from "@/components/my-profile/tabsection/my-profile-orgainsed-events";
import { MyProfileParticipatedEvents } from "@/components/my-profile/tabsection/my-profile-participated-events";
import { MyProfileCommentedPosts } from "@/components/my-profile/tabsection/myprofile-commented-posts";
import { MyProfileCreatedPosts } from "@/components/my-profile/tabsection/myprofile-created-posts";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function MyProfilePage() {
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4 hide-scrollbar">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-120px)] hide-scrollbar overflow-hidden ">
        {activeTab == "commented-posts" && <MyProfileCommentedPosts />}
        {activeTab == "created-posts" && <MyProfileCreatedPosts />}
        {activeTab == "favourite-posts" && <MyProfileLikedPosts />}
        {activeTab == "organised-events" && <MyProfileOrganisedEvents />}
        {activeTab == "participated-events" && <MyProfileParticipatedEvents />}
        {activeTab == "created-groups" && <MyProfileCreatedGroups />}
        {activeTab == "joined-groups" && <MyProfileJoinedGroups />}
        {activeTab == "edit-profile" && <EditProfile />}
      </div>

      <div
        className="hidden lg:block lg:max-w-[350px] rounded-lg h-fit mt-4 mr-2"
        style={{
          boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
        }}
      >
        <div className="bg-white rounded-xl w-[350px]">
          <ChatBase />
        </div>
      </div>
    </div>
  );
}
