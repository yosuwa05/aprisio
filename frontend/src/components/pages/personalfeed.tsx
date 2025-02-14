import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import placeholder from "@img/assets/placeholder-hero.jpeg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { FeedPosts } from "./personal-feed-posts";

export default function PersonalFeed() {
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const user = useGlobalAuthStore((state) => state.user);
  const topic = "technology";
  const router = useRouter();
  const updateActiveSubTopic = useGlobalFeedStore(
    (state) => state.setActiveSubTopic
  );

  useEffect(() => {
    updateActiveSubTopic(typeof topic === "string" ? topic : "");
  }, [topic]);

  const { data, isLoading } = useQuery({
    queryKey: ["community-info", topic, user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/community/info?slug=${topic}&userId=${user?.id}`
      );
      return res.data;
    },
  });

  return (
    <div>
      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        {isLoading ? (
          <Skeleton className="lg:max-w-[300px] min-w-[250px]" />
        ) : (
          <div className="lg:max-w-[300px] min-w-[250px]">
            <h1 className="font-[600] text-3xl text-textcol capitalize">
              {data.subTopic?.subTopicName}
            </h1>
            <p className="font-medium text-[#353535CC] opacity-80 mt-2">
              {data.subTopic?.description}
            </p>

            <div className="mt-4 flex flex-col gap-3 items-center">
              <Image src={placeholder} className="rounded-xl" alt="" />
              {data?.isUserJoined}
              {data?.isUserJoined ? null : (
                <Button className="rounded-full bg-buttoncol text-black font-bold shadow-none p-6 hover:bg-buttoncol">
                  Join Community
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex w-full max-w-[1200px] mx-auto gap-4">
          <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[91vh] hide-scrollbar overflow-hidden">
            <FeedPosts />
          </div>
        </div>
      </div>
    </div>
  );
}
