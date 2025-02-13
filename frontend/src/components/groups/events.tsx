import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { EventCard } from "./eventcard";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import GlobalLoader from "../globalloader";

type Props = {
  groupid: string;
  gropuslug: string;
};

export function EventsSection({ groupid, gropuslug }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const limit = 4;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  }: any = useInfiniteQuery<any>({
    queryKey: ["group-events", user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await _axios.get(
        `/noauth/group/events/${groupid}?userId=${user?.id}&page=${pageParam}&limit=${limit}`
      );
      return res?.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      const nextPage = allPages?.length + 1;
      return lastPage?.events?.length === limit ? nextPage : undefined;
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  console.log(data);

  const hasevents = !isLoading && data?.pages?.[0]?.events?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  return (
    <div className='my-4'>
      <div className='flex gap-2 items-center text-sm text-contrasttext cursor-pointer ml-2'>
        <Icon icon='tabler:plus' fontSize={22} />
        <h3
          className='font-semibold text-sm'
          onClick={() => {
            router.push(`/groups/${groupid}/new-event`);
          }}>
          Create Event
        </h3>
      </div>

      <div className='mt-6 flex-col flex gap-4'>
        {isLoading ? (
          <div className='flex flex-col justify-center items-center my-4 gap-4'>
            <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
            <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>

            <Skeleton className='w-full h-[80px]  min-w-[250px]'> </Skeleton>
          </div>
        ) : hasevents ? (
          data?.pages?.flatMap((page: any) =>
            page?.events?.map((event: any) => {
              return (
                <EventCard
                  key={event?._id}
                  event={event}
                  attending={data?.attending}
                  gropuslug={gropuslug}
                />
              );
            })
          )
        ) : (
          <p className='text-gray-500 text-xs font-semibold'>No Events found</p>
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
  );
}
