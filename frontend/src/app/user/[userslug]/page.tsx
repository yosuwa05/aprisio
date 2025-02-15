import { PersonalFeedPosts } from "@/components/pages/personal-feed-posts";

export default function UserPage() {
  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-150px)] hide-scrollbar overflow-hidden">
        <PersonalFeedPosts />
      </div>

      <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
        <div className="bg-white px-4 rounded-xl w-[350px]"></div>
      </div>
    </div>
  );
}
