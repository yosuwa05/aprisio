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
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type Suggetion = {
  slug: string;
  subTopicName: string;
};

export default function Feed() {
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
  const router = useRouter();
  const updateActiveSubTopic = useGlobalFeedStore(
    (state) => state.setActiveSubTopic,
  );

  useEffect(() => {
    updateActiveSubTopic(typeof topic === "string" ? topic : "");
  }, [topic]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["community-info", topic, user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/community/info?slug=${topic}&userId=${user?.id}`,
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

  const { data: suggetions, isLoading: isSuggetionsLoading } = useQuery({
    queryKey: ["topic-suggetions", topic],
    queryFn: async () => {
      const res = await _axios.get(`/subtopics/suggetions?limit=2`);
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["join-community"],
    mutationFn: async ({ subTopicId }: { subTopicId: string }) => {
      const res = await _axios.post(`/community/join`, {
        subTopicId,
        userId: user?.id ?? "",
      });
      return res;
    },
    onSuccess: ({ data }) => {
      if (data.ok) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.error.toString());
      }
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to join the community. Please try again.");
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
              {data?.subTopic?.subTopicName}
            </h1>
            <p className="font-medium text-[#353535CC] opacity-80 mt-2">
              {data?.subTopic?.description}
            </p>

            <div className="mt-4 flex flex-col gap-3 items-center">
              <Image src={placeholder} className="rounded-xl" alt="" />
              {!data?.isUserJoined && (
                <Button
                  onClick={() => {
                    mutate({
                      subTopicId: data?.subTopic?._id ?? "",
                    });
                  }}
                  disabled={isPending}
                  className="rounded-full bg-buttoncol text-black font-bold shadow-none p-6 hover:bg-buttoncol"
                >
                  Join Community
                </Button>
              )}
            </div>

            {!isSuggetionsLoading && (
              <div>
                <h3 className="font-normal text-xl my-4">
                  Other Sub - Catergories
                </h3>

                <div className="gap-4 flex flex-col">
                  {suggetions?.topics?.map((e: Suggetion, index: number) => {
                    return (
                      <div
                        key={index}
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => {
                          router.push(`/feed/explore/${e?.slug}`);
                        }}
                      >
                        <p>{e?.subTopicName}</p>
                        <ChevronRight />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex w-full max-w-[1200px] mx-auto gap-4">
          <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-180px)] hide-scrollbar overflow-hidden">
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
                      onClick={() =>
                        router.push(`/groups/${item?.groupSulg}/${item?._id}`)
                      }
                      className="flex justify-between items-center cursor-pointer  w-full"
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
