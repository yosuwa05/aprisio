"use client";

import { GroupsSection } from "@/components/groups-section";
import { PostsSection } from "@/components/posts-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import placeholder from "@img/assets/placeholder-hero.jpeg";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Feed() {
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
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

  const { data: joined } = useQuery({
    queryKey: ["user-Joined-things"],
    queryFn: async () => {
      return await _axios.get(`/personal/joined-things`);
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
          <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-150px)] hide-scrollbar overflow-hidden">
            {activeLayout == "post" && <PostsSection />}
            {activeLayout == "group" && <GroupsSection />}
          </div>

          <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
            <div className="bg-white px-4 rounded-xl w-[350px]">
              <div className="relative h-[110px] bg-white flex justify-center items-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/assets/placeholder-hero.jpeg)",
                    opacity: 0.3,
                  }}
                />

                <Button
                  onClick={() => {
                    console.log("Create Event");
                    router.push("/feed/create-event");
                  }}
                  className="relative z-10 bg-white text-[#D49D0D] shadow-[#d49c0d46] shadow-lg hover:bg-white"
                >
                  <Plus />
                  Create Event
                </Button>
              </div>

              <h1 className="text-2xl text-textcol my-4 font-semibold">
                Events
              </h1>

              <div className="flex flex-col  items-start gap-2 my-2">
                {joined?.data?.joinedEvents?.length ? (
                  joined?.data?.joinedEvents?.map((item: any) => (
                    <div
                      className="flex justify-between items-center w-full"
                      key={item?._id}
                    >
                      <div className="text-textcol flex flex-col gap-2">
                        <h4 className="text-[15px] font-medium">
                          {item?.eventName}
                        </h4>
                      </div>

                      <Button className="rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]">
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 w-full text-fadedtext text-sm">
                    No events joined
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
