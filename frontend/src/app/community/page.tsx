"use client";

import { TopCommunityBar } from "@/components/community/top-community-bar";
import { TopicsCard } from "@/components/community/topics-card";
import Topbar from "@/components/shared/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function Community() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["community"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(`/community?page=${pageParam}&limit=1`);
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
      <Topbar />
      <TopCommunityBar />

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
                  <div className="flex flex-wrap gap-4">
                    {post.subTopic.map(
                      (subTopic: any, subTopicIndex: number) => (
                        <TopicsCard
                          key={subTopicIndex}
                          subTopicName={subTopic.subTopicName}
                          description={subTopic.description}
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
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
