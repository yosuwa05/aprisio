import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useIntersection } from "@mantine/hooks";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import GlobalLoader from "../globalloader";
import { Skeleton } from "../ui/skeleton";
import { EventCard } from "./eventcard";
import { toast } from "sonner";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { Button } from "../ui/button";

type Props = {
  groupid: string;
  gropuslug: string;
};

export function EventsSection({ groupid, gropuslug }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const limit = 10;
  const updateActiveGroup = useGlobalFeedStore((state) => state.setActiveGroup);
  const updateActiveGroupId = useGlobalFeedStore(
    (state) => state.setActiveGroupId
  );
  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["group-events", user?.id, groupid],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await _axios.get(
        `/noauth/group/events?groupid=${groupid}&userId=${user?.id}&page=${pageParam}&limit=${limit}`
      );
      return res?.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages?.length + 1;
      return lastPage?.events?.length === limit ? nextPage : undefined;
    },
  });

  console.log(data);

  const { mutate, isPending } = useMutation({
    mutationFn: async (groupid: any) => {
      return await _axios.post("/group/join", {
        groupId: groupid,
      });
    },

    onSuccess: (data) => {
      if (data.data.ok) {
        toast(data.data.message || "Joined group successfully");
        queryClient.invalidateQueries({
          queryKey: ["groups-feed" + user?.id, groupid],
        });
        refetch();
      }
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
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
    <div className='my-4'>
      {data?.pages?.[0]?.canJoin ? (
        <Button
          disabled={isPending}
          variant={"ghost"}
          className='flex gap-2 items-center text-sm text-contrasttext cursor-pointer px-4'
          onClick={() => {
            if (!user) return toast.error("Login to continue");
            mutate(groupid);
          }}>
          <Icon icon='tabler:plus' fontSize={22} />
          <h3 className='font-semibold text-sm'>Join Group</h3>
        </Button>
      ) : (
        <div
          className='flex gap-2 items-center text-sm text-contrasttext cursor-pointer ml-2'
          onClick={() => {
            if (!user) return toast.error("Login to continue");
            updateActiveGroup(typeof gropuslug === "string" ? gropuslug : "");
            updateActiveGroupId(typeof groupid === "string" ? groupid : "");
            router.push(`/feed/create-event/`);
          }}>
          <Icon icon='tabler:plus' fontSize={22} />
          <h3 className='font-semibold text-sm'>Create Event</h3>
        </div>
      )}

      <div className='mt-6 flex-col flex gap-4'>
        {isLoading ? (
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-3 gap-4'>
              <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
              <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
              <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
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
          data?.pages?.flatMap((page: any) =>
            page?.events?.map((event: any, index: number) => {
              return (
                <EventCard
                  key={event?._id}
                  event={event}
                  gropuslug={gropuslug}
                />
              );
            })
          )
        ) : (
          <div className='flex flex-col justify-center items-center gap-4'>
            <p className='text-gray-500 text-xs font-semibold'>
              No Events found
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
  );
}
