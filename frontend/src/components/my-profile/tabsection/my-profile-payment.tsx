import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MyProfilePaymentCard from "../my-profile-payment-card";

export const MyProfilePayments = () => {
  const user = useGlobalAuthStore((state) => state.user);

  const limit = 10;
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["my-profile-paid-tickets", user?.id, activeTab],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/events/paidtickets/?page=${pageParam}&limit=${limit}&userId=${user?.id}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.tickets?.length === limit ? nextPage : undefined;
      },
    });

  console.log(data);

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='flex flex-col gap-6 items-center p-1 lg:p-4'>
      {isLoading ? (
        <div className='flex flex-col gap-4 w-full '>
          {[...Array(1)].map((_, i) => (
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
      ) : data && data.pages && data?.pages.length > 0 ? (
        data.pages.map((page, pageIndex) =>
          page?.tickets?.length > 0 ? (
            page?.tickets?.map((ticket: any, postIndex: number) => (
              <React.Fragment key={ticket?._id}>
                <MyProfilePaymentCard ticket={ticket} />
              </React.Fragment>
            ))
          ) : (
            <p
              key={`${pageIndex}-no-groups`}
              className='text-gray-500 text-xs font-semibold'>
              No Experiences found
            </p>
          )
        )
      ) : (
        <p className='text-gray-500'>No Groups</p>
      )}

      <div ref={ref} className='h-1'></div>

      {isLoading || isFetchingNextPage ? <GlobalLoader /> : <div></div>}
    </div>
  );
};
