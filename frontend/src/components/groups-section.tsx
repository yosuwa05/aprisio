"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GroupCard from "./groupCard";
import { GlobalLoader } from "./shared/global-loader";
import { Skeleton } from "./ui/skeleton";

export const GroupsSection = () => {
  const user = useGlobalAuthStore((state) => state.user);

  const { topic } = useParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["groups" + user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/noauth/group?page=${pageParam}&userId=${
            user?.id ?? ""
          }&subTopic=${topic}&limit=${10}`
        );
        return res;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        const { page, limit, total } = lastPage.data;
        const nextPage = page + 1;
        return nextPage * limit < total ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-6 items-center p-1 lg:p-4">
      {isLoading ? (
        <div className="flex flex-col gap-4 w-full ">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="flex gap-4 w-full">
              <Skeleton className="w-[50px] h-[50px] rounded-full" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-full h-[200px]" />
                <Skeleton className="w-full h-[15px]" />
                <Skeleton className="w-3/4 h-[15px]" />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-full h-[200px]" />
                <Skeleton className="w-full h-[15px]" />
                <Skeleton className="w-3/4 h-[15px]" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.pages && data?.pages.length > 0 ? (
        data.pages.map((page, pageIndex) =>
          page.data.groups.length > 0 ? (
            page.data.groups.map((group: any, postIndex: number) => (
              <React.Fragment key={`${pageIndex}-${postIndex}`}>
                <GroupCard group={group} />
              </React.Fragment>
            ))
          ) : (
            <p
              key={`${pageIndex}-no-groups`}
              className="text-gray-500 text-xs font-semibold"
            >
              No Groups found
            </p>
          )
        )
      ) : (
        <p className="text-gray-500">No Groups</p>
      )}

      <div ref={ref} className="h-1"></div>

      {isLoading || isFetchingNextPage ? <GlobalLoader /> : <div></div>}
    </div>
  );
};
