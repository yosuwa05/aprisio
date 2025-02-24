"use client";

import { EditProfile } from "@/components/my-profile/my-profile-edit";
import { MyProfileCreatedGroups } from "@/components/my-profile/tabsection/my-profile-created-groups";
import { MyProfileJoinedGroups } from "@/components/my-profile/tabsection/my-profile-joined-groups";
import { MyProfileOrganisedEvents } from "@/components/my-profile/tabsection/my-profile-orgainsed-events";
import { MyProfileParticipatedEvents } from "@/components/my-profile/tabsection/my-profile-participated-events";
import { MyProfileCommentedPosts } from "@/components/my-profile/tabsection/myprofile-commented-posts";
import { MyProfileCreatedPosts } from "@/components/my-profile/tabsection/myprofile-created-posts";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function MyProfilePage() {
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  return (
    <div className='flex w-full max-w-[1200px] mx-auto gap-4'>
      <div className='flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-90px)] hide-scrollbar overflow-hidden '>
        {activeTab == "commented-posts" && <MyProfileCommentedPosts />}
        {activeTab == "created-posts" && <MyProfileCreatedPosts />}
        {activeTab == "organised-events" && <MyProfileOrganisedEvents />}
        {activeTab == "participated-events" && <MyProfileParticipatedEvents />}
        {activeTab == "created-groups" && <MyProfileCreatedGroups />}
        {activeTab == "joined-groups" && <MyProfileJoinedGroups />}
        {activeTab == "edit-profile" && <EditProfile />}
      </div>

      <div className='hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit'>
        <div className='bg-white px-4 rounded-xl w-[350px]'></div>
      </div>
    </div>
  );
}
