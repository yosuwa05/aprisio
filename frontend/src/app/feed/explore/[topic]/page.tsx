"use client";

import { EventsSection } from "@/components/events-section";
import { GroupsSection } from "@/components/groups-section";
import { PostsSection } from "@/components/posts-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    (state) => state.setActiveSubTopic
  );

  useEffect(() => {
    updateActiveSubTopic(typeof topic === "string" ? topic : "");
  }, [topic]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["community-info", topic, user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/community/info?slug=${topic}&userId=${user?.id}`
      );
      return res.data;
    },
  });
  const queryClient = useQueryClient();

  const { data: joined } = useQuery({
    queryKey: ["user-Joined-things"],
    queryFn: async () => {
      return await _axios.get(`/personal/joined-things`);
    },
    retry: false,
  });

  const { data: suggetions, isLoading: isSuggetionsLoading } = useQuery({
    queryKey: ["topic-suggetions", topic],
    retry: false,
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
        queryClient.invalidateQueries({
          queryKey: ["joined"],
        });
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
      <div className='mt-2   container flex flex-wrap  mx-auto px-3'>
        {isLoading ? (
          <Skeleton className='lg:max-w-[335px] w-full' />
        ) : (
          <div className='lg:max-w-[335px] w-full'>
            <h1 className='font-[600] text-3xl text-textcol capitalize'>
              {data?.subTopic?.subTopicName}
            </h1>
            <p className='font-medium text-[#353535CC] opacity-80 mt-2'>
              {data?.subTopic?.description}
            </p>

            <div className='mt-4 flex flex-col gap-3 items-center'>
              <Image
                src={BASE_URL + `/file?key=${data?.subTopic?.image}`}
                className='rounded-xl object-cover '
                alt=''
                width={500}
                height={500}
              />
              {!data?.isUserJoined && (
                <div>
                  <Button
                    onClick={() => {
                      if (!user) return toast.error("Login to join");
                      mutate({
                        subTopicId: data?.subTopic?._id ?? "",
                      });
                    }}
                    disabled={isPending}
                    className='rounded-full bg-buttoncol text-black font-bold shadow-none p-6 hover:bg-buttoncol'>
                    Join Community
                  </Button>
                </div>
              )}
            </div>

            {!isSuggetionsLoading && user && (
              <div>
                <h3 className='font-normal text-xl my-4'>
                  Other Sub - Communities
                </h3>

                <div className='gap-4 flex flex-col'>
                  {suggetions?.topics?.map((e: Suggetion, index: number) => {
                    return (
                      <div
                        key={index}
                        className='flex gap-2 items-center cursor-pointer'
                        onClick={() => {
                          router.push(`/feed/explore/${e?.slug}`);
                        }}>
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

        <div className='lg:flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-120px)] hide-scrollbar overflow-hidden lg:min-w-[600px] w-full lg:pt-0 pt-5'>
          {activeLayout == "post" && <PostsSection />}
          {activeLayout == "group" && <GroupsSection />}
          {activeLayout == "event" && (
            <EventsSection groupid={""} gropuslug={""} />
          )}
        </div>
        <div className='hidden bxl:block lg:max-w-[350px] rounded-lg h-fit mt-4 mr-2'>
          <div className='bg-white px-4 rounded-xl w-[350px]'>
            <div className='relative h-[110px] bg-white flex justify-center items-center overflow-hidden'>
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                  backgroundImage: "url(/assets/placeholder-hero.jpeg)",
                  opacity: 0.3,
                }}
              />

              {/* <Button
                onClick={() => {
                  if (!user) return toast.error("Login to continue");
                  router.push("/feed/create-event");
                }}
                className='relative z-10 bg-white text-[#D49D0D] shadow-[#d49c0d46] shadow-lg hover:bg-white'>
                <Plus />
                Create Event
              </Button> */}
            </div>

            <h1 className='text-2xl text-textcol my-4 font-semibold'>Events</h1>

            <div className='flex flex-col  items-start gap-2 my-2'>
              {joined?.data?.joinedEvents?.length ? (
                joined?.data?.joinedEvents?.map((item: any) => (
                  <div
                    onClick={() => router.push(`/events/${item?._id}`)}
                    className='flex justify-between items-center cursor-pointer  w-full'
                    key={item?._id}>
                    <div className='text-textcol flex flex-col gap-2'>
                      <h4 className='text-[15px] font-medium'>
                        {item?.eventName}
                      </h4>
                    </div>

                    <Button className='rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]'>
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className='text-center py-2 w-full text-fadedtext text-sm'>
                  No events joined
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
