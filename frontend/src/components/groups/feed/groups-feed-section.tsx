"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GlobalLoader from "../../globalloader";
import { Skeleton } from "../../ui/skeleton";
import GroupsFeedPostcard from "./groups-feed-postcard";

type IAuthor = {
  name: string;
};
type IPost = {
  author: IAuthor;
  title: string;
  description: string;
  createdAt: string;
  _id: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  url?: string;
  image?: string;
};

export const GroupsFeedSection = () => {
  const user = useGlobalAuthStore((state) => state.user);
  const { groupid } = useParams();

  const router = useRouter();

  const updateActiveGroup = useGlobalFeedStore((state) => state.setActiveGroup);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["groups-feed" + user?.id, groupid],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/post/group?page=${pageParam}&userId=${
            user?.id ?? ""
          }&groupid=${groupid}`
        );
        return res;
      },
      initialPageParam: 1,
      retry: false,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor,
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
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='my-4'>
      {/* <div
        className="flex gap-2 items-center justify-end text-sm text-contrasttext cursor-pointer px-4"
        onClick={() => {
          updateActiveGroup(typeof groupid === "string" ? groupid : "");
          router.push(`/create-post/group`);
        }}
      >
        <Icon icon="tabler:plus" fontSize={22} />
        <h3 className="font-semibold text-sm">Create Post</h3>
      </div> */}

      <div className='max-h-[calc(100vh-280px)] w-full overflow-scroll hide-scrollbar p-2'>
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
        ) : data && data.pages && data.pages.length > 0 ? (
          data.pages.some((page) => page.data.posts.length > 0) ? (
            data.pages.map((page, pageIndex) =>
              page.data.posts.map((post: IPost, postIndex: number) => (
                <React.Fragment key={`${pageIndex}-${postIndex}`}>
                  <GroupsFeedPostcard
                    post={{
                      author: post.author.name,
                      title: post.title,
                      description: post.description,
                      createdAt: post.createdAt,
                      id: post._id,
                      likeCount: post.likesCount,
                      commentCount: post.commentsCount,
                      likedByMe: post.likedByMe,
                      url: post.url || "",
                      image: post.image || "",
                    }}
                    topic={groupid?.toString() || ""}
                  />
                </React.Fragment>
              ))
            )
          ) : (
            <p className='flex justify-center items-center p-4 text-gray-500 text-xs font-semibold'>
              No posts found
            </p>
          )
        ) : (
          <p className='text-gray-500'>No posts</p>
        )}

        <div ref={ref} className='h-1'></div>

        <div className='flex justify-center items-center p-4'>
          {isFetchingNextPage && <GlobalLoader />}
        </div>
      </div>
    </div>
  );
};
