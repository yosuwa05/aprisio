"use client";

import { ChatBase } from "@/components/chat/chat-base";
import { MyProfileCommentedPosts } from "@/components/my-profile/myprofile-commented-posts";
import { MyProfileCreatedPosts } from "@/components/my-profile/myprofile-created-posts";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export default function MyProfilePage() {
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4 hide-scrollbar">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-90px)] hide-scrollbar overflow-hidden ">
        {activeTab == "commented-posts" && <MyProfileCommentedPosts />}
        {activeTab == "created-posts" && <MyProfileCreatedPosts />}
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
