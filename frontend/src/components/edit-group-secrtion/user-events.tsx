import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EventCard } from "../groups/eventcard";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
type Props = {
  groupId: string;
};
export function GroupUserEvents({ groupId }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["group-events", user?.id, groupId],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/events/group-events/?groupId=${groupId}&page=${pageParam}&limit=${limit}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.events?.length === limit ? nextPage : undefined;
      },
    });

  return (
    <main className=' h-[45vh] hide-scrollbar w-full  overflow-y-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full '>
        {isLoading &&
          Array.from({ length: limit }).map((_, idx) => (
            <Skeleton key={idx} className='w-full h-[150px] rounded-lg' />
          ))}

        {!isLoading && data?.pages?.[0]?.events?.length === 0 && (
          <p className='text-fadedtext text-center text-sm mt-5'>
            No Events found
          </p>
        )}

        {!isLoading &&
          data?.pages?.flatMap((page) =>
            page?.events?.map((event: any) => (
              <EventCard
                key={event?._id}
                event={event}
                gropuslug={event?.group?.slug}
              />
            ))
          )}
      </div>

      {hasNextPage && (
        <div className='flex justify-center pt-2'>
          <Button
            className='text-white rounded-2xl bg-buttoncol hover:bg-buttoncol px-6 py-2'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </main>
  );
}
