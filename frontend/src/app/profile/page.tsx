"use client";

import { MyProfileCommentedPosts } from "@/components/my-profile/myprofile-commented-posts";
import { MyProfileCreatedPosts } from "@/components/my-profile/myprofile-created-posts";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function MyProfilePage() {
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-90px)] hide-scrollbar overflow-hidden ">
        {activeTab == "commented-posts" && <MyProfileCommentedPosts />}
        {activeTab == "created-posts" && <MyProfileCreatedPosts />}
      </div>

      <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
        <div className="bg-white px-4 rounded-xl w-[350px]"></div>
      </div>
    </div>
  );
}
