import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MyProfilePostCard from "./myrofile-postcard";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

export function MyProfileCommentedPosts() {
  const user = useGlobalAuthStore((state) => state.user);
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  console.log(activeTab);
  const limit = 1;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["my-profile-posts", user?.id, activeTab],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/myprofile/commented-posts?page=${pageParam}&limit=${limit}&userId=${user?.id}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.posts?.length === limit ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const hasPosts = !isLoading && data?.pages?.[0]?.posts?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);
  return (
    <div className='flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar  items-center p-1 lg:p-4'>
      {isLoading ? (
        <div className='flex flex-col gap-4 w-full'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex gap-4 w-full'>
              <Skeleton className='w-[50px] h-[50px] rounded-full' />
              <div className='flex flex-col gap-2 w-full'>
                <Skeleton className='w-full h-[200px]' />
                <Skeleton className='w-full h-[15px]' />
                <Skeleton className='w-3/4 h-[15px]' />
              </div>
            </div>
          ))}
        </div>
      ) : hasPosts ? (
        data?.pages?.flatMap((page) =>
          page?.posts?.map((post: any) => {
            return (
              <React.Fragment key={post?._id}>
                <MyProfilePostCard
                  post={{
                    author: post?.authorName,
                    title: post?.title,
                    description: post?.description,
                    createdAt: post?.createdAt,
                    id: post?._id,
                    likeCount: post?.likesCount,
                    commentCount: post?.commentsCount,
                    likedByMe: post?.likedByMe,
                    url: post?.url || "",
                    image: post?.image || "",
                  }}
                  // groupid={groupid?.toString() ?? ""}
                />
              </React.Fragment>
            );
          })
        )
      ) : (
        <p className='text-gray-500 text-xs font-semibold'>No posts found</p>
      )}
      <div ref={ref} className='h-10'></div>

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
