"use client";

import { TopicsCard } from "@/components/community/topics-card";
import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Community() {
  const user = useGlobalAuthStore((state) => state.user);
  const updateActiveSubTopic = useGlobalFeedStore(
    (state) => state.setActiveSubTopic
  );
  const updateActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    updateActiveSubTopic("");
    updateActiveLayout("post");
  }, []);

  const limit = 5;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["community", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/community?page=${pageParam}&limit=${limit}&userId=${user?.id}`
        );
        return res?.data; // Ensure to return only data
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.topics?.length === limit ? nextPage : undefined;
      },
    });

  const hasTopics = !isLoading && data?.pages?.[0]?.topics?.length > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className='bg-white mx-2 md:mx-12 mt-2 shadow-lg rounded-lg p-6 text-center flex font-roboto flex-col gap-4'>
        <div className=' text-base  md:text-xl font-semibold flex items-center justify-center gap-2'>
          It’s free! Go ahead and start posting
          {/* Tooltip for larger screens */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='cursor-pointer hidden sm:inline-block'>
                  <Icon
                    icon='mingcute:question-fill'
                    className='text-gray-500 text-lg'
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent className='max-w-sm text-sm text-center'>
                Create your own Group in the community of your choice. Invite
                friends and Aprisio members to join the Group.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Dialog for mobile */}
          <span
            className='cursor-pointer sm:hidden'
            onClick={() => setIsDialogOpen(true)}>
            <Icon
              icon='mingcute:question-fill'
              className='text-gray-500 text-lg'
            />
          </span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Info</DialogTitle>
          </DialogHeader>
          <p className='text-center text-sm'>
            Create your own Group in the community of your choice. Invite
            friends and Aprisio members to join the Group.
          </p>
        </DialogContent>
      </Dialog>
      {/* <div className='bg-white  mx-2 md:mx-12 mt-2  shadow-lg rounded-lg p-6 text-center flex  font-roboto flex-col gap-4'>
       
       <p className='text-lg  text-[#222222] leading-relaxed'>
          <span className=''>Create your own group</span> in the community and
          sub-community of your choice. invite your friends and other aprisio
          members with shared interests.
        </p>
        <p className='text-lg text-[#000000]'>
          <span className=' font-semibold'>
            Media <span className='font-normal'>(Community)</span>
          </span>{" "}
          {"→"}
          <span className=' font-semibold'>
            {" "}
            New Media <span className='font-normal'>(Sub-Community)</span>
          </span>{" "}
          {"→"}
          <span className=' font-semibold'> Your Group</span>.
          <br />
          <span className=' '>It’s free!</span> Go ahead and create your own
          group today.
        </p> 
      </div> */}
      <div className='mx-2 md:mx-12 mt-6'>
        {isLoading ? (
          <div className='flex flex-col gap-4 mt-5 w-full'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='flex gap-4 w-full'>
                <Skeleton className='w-[50px] h-[50px] rounded-full' />
                <div className='flex flex-col gap-2 w-full'>
                  <Skeleton className='w-full h-[200px]' />
                  <Skeleton className='w-full h-[15px]' />
                  <Skeleton className='w-3/4 h-[15px]' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <Skeleton className='w-full h-[200px]' />
                  <Skeleton className='w-full h-[15px]' />
                  <Skeleton className='w-3/4 h-[15px]' />
                </div>
              </div>
            ))}
          </div>
        ) : hasTopics ? (
          data?.pages?.flatMap((page, pageIndex) =>
            page?.topics?.map((topic: any) => {
              return (
                <div key={`${pageIndex}-${topic._id}`}>
                  <h1 className='my-4 font-bold text-2xl'>{topic.topicName}</h1>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                    {topic.subTopic.map(
                      (subTopic: any, subTopicIndex: number) => (
                        <TopicsCard
                          key={subTopicIndex}
                          subTopicName={subTopic.subTopicName}
                          description={subTopic.description}
                          subTopicId={subTopic._id}
                          joined={subTopic.joined}
                          slug={subTopic.slug}
                          groupCount={subTopic.groupCount}
                          totalEvents={subTopic.totalEvents}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div className='flex flex-col justify-center items-center gap-4'>
            <p className='text-gray-500 text-xs font-semibold'>
              No Topics found
            </p>
          </div>
        )}
        <div ref={ref} className='h-14 pb-4'></div>
      </div>

      {isLoading || isFetchingNextPage ? (
        <div className='flex justify-center items-center my-4'>
          <GlobalLoader />
        </div>
      ) : null}
    </>
  );
}
