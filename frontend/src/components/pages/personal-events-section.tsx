import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import GlobalLoader from "../globalloader";
import { Skeleton } from "../ui/skeleton";
import { Event, PersonalEventCard } from "./personalEventCard";

export function PersonalEventsSection({}) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();

  const { userslug } = useParams();

  const limit = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["group-events", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/profile/personal/events?userId=${userslug}&page=${pageParam}&limit=${limit}`
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
    <div className="">
      <div className="flex-col flex gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="w-full h-[100px]  min-w-[250px]"> </Skeleton>
              <Skeleton className="w-full h-[100px]  min-w-[250px]"> </Skeleton>
              <Skeleton className="w-full h-[100px]  min-w-[250px]"> </Skeleton>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full">
              <Skeleton className="col-span-1 h-[100px]  min-w-[250px]">
                {" "}
              </Skeleton>
              <Skeleton className="col-span-3 h-[100px]  min-w-[250px]">
                {" "}
              </Skeleton>
            </div>
          </div>
        ) : hasevents ? (
          data?.pages?.flatMap((page) =>
            page?.events?.map((event: Event) => {
              return <PersonalEventCard key={event?._id} event={event} />;
            })
          )
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-gray-500 text-xs font-semibold">
              No Events created
            </p>
          </div>
        )}
        <div ref={ref} className="h-10"></div>
      </div>
      {isLoading || isFetchingNextPage ? (
        <div className="flex justify-center items-center my-4">
          <GlobalLoader />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
