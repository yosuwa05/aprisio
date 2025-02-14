import { _axios } from "@/lib/axios-instance";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GlobalLoader from "./globalloader";
import SharedPostcard from "./sharedpost-card";
import { Skeleton } from "./ui/skeleton";

export function GroupShareSection({}) {
  const { groupid } = useParams();

  const limit = 1;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["shared-group-post", groupid],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/group/sharedpost?page=${pageParam}&limit=${limit}&group=${groupid}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.sharedPosts?.length === limit ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const hasPosts = !isLoading && data?.pages?.[0]?.sharedPosts?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-6 items-center p-1 lg:p-4">
      {isLoading ? (
        <div className="flex flex-col gap-4 w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 w-full">
              <Skeleton className="w-[50px] h-[50px] rounded-full" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-full h-[200px]" />
                <Skeleton className="w-full h-[15px]" />
                <Skeleton className="w-3/4 h-[15px]" />
              </div>
            </div>
          ))}
        </div>
      ) : hasPosts ? (
        data?.pages?.flatMap((page) =>
          page?.sharedPosts?.map((post: any) => {
            return (
              <React.Fragment key={post?._id}>
                <SharedPostcard
                  post={{
                    author: post?.postId?.author?.name,
                    title: post?.postId?.title,
                    description: post?.postId?.description,
                    createdAt: post?.postId?.createdAt,
                    id: post?.postId?._id,
                    likeCount: post?.postId?.likesCount,
                    commentCount: post?.postId?.commentsCount,
                    likedByMe: post?.postId?.likedByMe,
                    url: post?.postId?.url || "",
                    image: post?.postId?.image || "",
                  }}
                  groupid={groupid?.toString() ?? ""}
                />
              </React.Fragment>
            );
          })
        )
      ) : (
        <p className="text-gray-500 text-xs font-semibold">No posts found</p>
      )}
      <div ref={ref} className="h-10"></div>

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
