import { FeedPosts } from "@/components/pages/personal-feed-posts";

export default function UserPage() {
  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-4">
      <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[91vh] hide-scrollbar overflow-hidden">
        <FeedPosts />
      </div>

      <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
        <div className="bg-white px-4 rounded-xl w-[350px]"></div>
      </div>
    </div>
  );
}
