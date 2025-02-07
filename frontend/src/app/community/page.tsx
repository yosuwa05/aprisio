import { TopCommunityBar } from "@/components/community/top-community-bar";
import { TopicsCard } from "@/components/community/topics-card";
import Topbar from "@/components/shared/topbar";

export default function Community() {
  return (
    <>
      <Topbar />

      <TopCommunityBar />

      <div className="mx-2 md:mx-12 mt-6">
        <h2 className="font-bold text-black text-2xl mb-4">
          Technology & Science
        </h2>

        <TopicsCard />
      </div>

      <div className="mx-2 md:mx-12 mt-6">
        <h2 className="font-bold text-black text-2xl mb-4">
          Technology & Science
        </h2>

        <div className="flex gap-4 flex-wrap">
          <TopicsCard />
          <TopicsCard />
          <TopicsCard />
          <TopicsCard />
          <TopicsCard />
          <TopicsCard />
        </div>
      </div>

      <div className="mx-2 md:mx-12 mt-6">
        <h2 className="font-bold text-black text-2xl mb-4">
          Technology & Science
        </h2>

        <TopicsCard />
      </div>
    </>
  );
}
