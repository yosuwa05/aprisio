"use client";

import { TopicsCard } from "@/components/community/topics-card";
import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function Community() {
  const user = useGlobalAuthStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["community", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/community?page=${pageParam}&limit=1&userId=${user?.id}`
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
    <>
      <div className="mx-2 md:mx-12 mt-6">
        {isLoading ? (
          <div className="flex flex-col gap-4 w-full ">
            {[...Array(5)].map((_, i) => (
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
            page.data.topics.length > 0 ? (
              page.data.topics.map((post: any, postIndex: number) => (
                <div key={`${pageIndex}-${postIndex}`}>
                  <h1 className="my-4 font-bold text-2xl">{post.topicName}</h1>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(325px,1fr))] gap-4">
                    {post.subTopic.map(
                      (subTopic: any, subTopicIndex: number) => (
                        <TopicsCard
                          key={subTopicIndex}
                          subTopicName={subTopic.subTopicName}
                          description={subTopic.description}
                          subTopicId={subTopic._id}
                          joined={subTopic.joined}
                          slug={subTopic.slug}
                        />
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p
                key={`${pageIndex}-no-posts`}
                className="text-gray-500 text-xs font-semibold"
              >
                No posts found
              </p>
            )
          )
        ) : (
          <p className="text-gray-500">No posts</p>
        )}
      </div>

      <div ref={ref} className="h-1"></div>

      {isLoading || isFetchingNextPage ? (
        <div className="flex justify-center items-center my-4">
          <GlobalLoader />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
