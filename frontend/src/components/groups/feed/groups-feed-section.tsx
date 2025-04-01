"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useIntersection } from "@mantine/hooks";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GlobalLoader from "../../globalloader";
import { Skeleton } from "../../ui/skeleton";
import GroupsFeedPostcard from "./groups-feed-postcard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type IAuthor = {
  name: string;
  _id: string;
  image?: string;
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
  userImage?: string;
};

export const GroupsFeedSection = () => {
  const user = useGlobalAuthStore((state) => state.user);
  const { groupid } = useParams();
  const { topic } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateActiveGroup = useGlobalFeedStore((state) => state.setActiveGroup);
  console.log(groupid, "feed", topic);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (groupid: any) => {
      return await _axios.post("/group/join", {
        groupId: groupid,
      });
    },

    onSuccess: (data) => {
      if (data.data.ok) {
        toast(data.data.message || "Joined group successfully");
        queryClient.invalidateQueries({
          queryKey: ["groups" + user?.id, topic],
        });
        queryClient.invalidateQueries({
          queryKey: ["group-events", user?.id, groupid],
        });
        refetch();
      }
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
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
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='my-4'>
      {data?.pages?.[0]?.data?.canJoin ? (
        <Button
          disabled={isPending}
          className='rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
          onClick={() => {
            if (!user) return toast.error("Login to continue");
            mutate(data?.pages?.[0]?.data?.groupId);
          }}>
          <Icon icon='tabler:plus' fontSize={22} />
          <h3 className='font-semibold text-sm'>Join Group</h3>
        </Button>
      ) : (
        <Button
          className='rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
          onClick={() => {
            if (!user) return toast.error("Login to continue");
            updateActiveGroup(typeof groupid === "string" ? groupid : "");
            router.push(`/create-post/group`);
          }}>
          <Icon icon='tabler:plus' fontSize={22} />
          <h3 className='font-semibold text-sm'>Create Post</h3>
        </Button>
      )}

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
        ) : data && data?.pages && data?.pages?.length > 0 ? (
          data?.pages?.some((page) => page?.data?.posts?.length > 0) ? (
            data?.pages?.map((page, pageIndex) =>
              page?.data?.posts?.map((post: IPost, postIndex: number) => (
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
                      userImage: post?.author?.image || "",
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
