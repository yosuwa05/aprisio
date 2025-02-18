import { useInfiniteQuery } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { _axios } from "@/lib/axios-instance";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronsDown, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  searchKey: string;
  postId: string;
};

export function ShareUsers({ searchKey }: Props) {
  const limit = 5;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["fetch-users", limit, searchKey],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/user/getall?page=${pageParam}&limit=${limit}&q=${searchKey}`
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.users?.length === limit ? nextPage : undefined;
      },
    });

  return (
    <main>
      <div className='flex flex-col gap-3'>
        {isLoading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className='flex gap-3 items-center'>
              <Skeleton className='w-8 h-8 rounded-md' />
              <Skeleton className='h-8 w-full' />
            </div>
          ))}

        {!isLoading && data?.pages?.[0]?.users?.length === 0 && (
          <p className='text-fadedtext text-center text-sm mt-5'>
            No Users found
          </p>
        )}

        {!isLoading &&
          data?.pages?.flatMap((page) =>
            page?.users?.map((user: any) => (
              <div key={user?._id} className='flex gap-3 items-center'>
                <Checkbox className='scale-125 data-[state=checked]:bg-contrasttext data-[state=checked]:border-contrasttext' />
                <h4 className='text-textcol text-base  md:text-lg font-medium'>
                  {user?.name}
                </h4>
              </div>
            ))
          )}

        {hasNextPage && (
          <div className='flex justify-center'>
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant='ghost'
              size='icon'>
              {isFetchingNextPage ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                <ChevronsDown className='h-5 w-5' />
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
