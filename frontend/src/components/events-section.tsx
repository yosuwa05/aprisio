import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import GlobalLoader from "./globalloader";
import { EventCard } from "./groups/eventcard";
import { Skeleton } from "./ui/skeleton";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

type Props = {
  groupid: string;
  gropuslug: string;
};

export function EventsSection({ groupid, gropuslug }: Props) {
  const user = useGlobalAuthStore((state) => state.user);

  const { topic } = useParams();

  const limit = 10;
  let layouts = ["post", "group", "event"];
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const setActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["group-events", user?.id, groupid, topic],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/subtopics/events?userId=${user?.id}&page=${pageParam}&limit=${limit}&topicId=${topic}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.events?.length === limit ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const hasevents = !isLoading && data?.pages?.[0]?.events?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className='w-full flex justify-between px-4 py-2 items-center'>
        <div className=' md:flex   rounded-full  hidden bg-white border-[1px] border-[#043A53] p-2  shadow-md'>
          {layouts.map((layout, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveLayout(layout as any);
              }}
              className={`capitalize cursor-pointer px-8 ${
                layout == activeLayout
                  ? "bg-[#F2F5F6] text-[#043A53] py-2 rounded-full border-[0.2px] border-[#043A53]"
                  : "py-2 rounded-full"
              }`}>
              {layout}
            </div>
          ))}
        </div>
        {/* <div className='flex justify-end w-full  md:w-fit'>
           <Button
             className='rounded-full    bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
             onClick={() => {
               if (!user) {
                 return toast.error("Login to continue");
               }
               if (activeLayout != "group") {
                 if (
                   !joined?.data?.TopicsFollowed ||
                   joined.data.TopicsFollowed.length === 0
                 ) {
                   return toast.error(
                     "You must join the community to create a post"
                   );
                 }
               }
               router.push(
                 activeLayout == "group"
                   ? "/feed/create-group/new"
                   : `/feed/create-post/new`
               );
             }}>
             {activeLayout == "group" ? "Create Group" : "Create Post"}
           </Button>
         </div> */}
      </div>
      <div className=''>
        <div className='flex-col flex gap-4 px-2'>
          {isLoading ? (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-3 gap-4'>
                <Skeleton className='w-full h-[100px]  min-w-[250px]'>
                  {" "}
                </Skeleton>
                <Skeleton className='w-full h-[100px]  min-w-[250px]'>
                  {" "}
                </Skeleton>
                <Skeleton className='w-full h-[100px]  min-w-[250px]'>
                  {" "}
                </Skeleton>
              </div>

              <div className='grid grid-cols-4 gap-4 w-full'>
                <Skeleton className='col-span-1 h-[100px]  min-w-[250px]'>
                  {" "}
                </Skeleton>
                <Skeleton className='col-span-3 h-[100px]  min-w-[250px]'>
                  {" "}
                </Skeleton>
              </div>
            </div>
          ) : hasevents ? (
            data?.pages?.flatMap((page) =>
              page?.events?.map((event: any, index: number) => {
                return (
                  <EventCard key={index} event={event} gropuslug={gropuslug} />
                );
              })
            )
          ) : (
            <div className='flex flex-col justify-center items-center gap-4'>
              <p className='text-gray-500 text-xs font-semibold pt-2'>
                Create a Group or Join a Group to Create Event
              </p>
            </div>
          )}
          <div ref={ref} className='h-10'></div>
        </div>
        {isLoading || isFetchingNextPage ? (
          <div className='flex justify-center items-center my-4'>
            <GlobalLoader />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
