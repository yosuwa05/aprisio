import GlobalLoader from "@/components/globalloader";
import { EventCard } from "@/components/groups/eventcard";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
export function MyProfileOrganisedEvents() {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const limit = 10;
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["my-profile-organised-events", user?.id, activeTab],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/myprofile/organised-events/?userId=${user?.id}&page=${pageParam}&limit=${limit}`
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
    <div className="my-2">
      <div className=" flex-col flex gap-4">
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
          data?.pages?.flatMap((page: any) =>
            page?.events?.map((event: any, index: number) => {
              return (
                <EventCard
                  key={event?._id}
                  event={event}
                  gropuslug={event?.group?.slug}
                />
              );
            })
          )
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-gray-500 text-xs font-semibold">
              No Events found
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
