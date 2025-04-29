"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Postcard from "./postcard";
import { GlobalLoader } from "./shared/global-loader";
import { Skeleton } from "./ui/skeleton";
import DockMenu from "@/components/dockmenu";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";

type IAuthor = {
  name: string;
  image: string;
  _id: string;
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
  subTopic?: any;
  group?: any;
};

type Props = {
  isUserJoined: boolean;
};

export const PostsSection = ({ isUserJoined }: Props) => {
  const user = useGlobalAuthStore((state) => state.user);
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const setActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );
  const activeSubTopic = useGlobalFeedStore((state) => state.activeSubTopic);
  const activeSubTopicName = useGlobalFeedStore(
    (state) => state.activeSubTopicName
  );
  let layouts = ["post", "group", "event"];
  const { topic } = useParams();
  const router = useRouter();
  const { data: joined } = useQuery({
    queryKey: ["joined"],
    retry: false,
    staleTime: Infinity,
    enabled: user != null,
    queryFn: async () => {
      return await _axios.get(`/personal/joined-things`);
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects" + user?.id, topic],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/post?page=${pageParam}&userId=${user?.id ?? ""}&subTopic=${topic}`
        );
        return res;
      },

      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => lastPage.data.nextCursor,
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
    <>
      <div className='w-full flex justify-between px-4 py-2 items-center'>
        <div className=' md:flex   rounded-full  hidden bg-white border-[1px] border-[#043A53] p-2  shadow-md'>
          {layouts.map((layout, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveLayout(layout as any);
              }}
              className={`capitalize cursor-pointer px-8 ${
                layout == activeLayout
                  ? "bg-[#F2F5F6] text-[#043A53] py-2 rounded-full border-[0.2px] border-[#043A53]"
                  : "py-2 rounded-full"
              }`}>
              {layout}
            </div>
          ))}
        </div>
        <div className='  hidden md:flex  justify-end w-full  md:w-fit'>
          <Button
            className='rounded-full    bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
            onClick={() => {
              if (!user) {
                return toast.error("Login to continue");
              }
              if (isUserJoined === false) {
                return toast.error("You must join the community to create ");
              }

              router.push(
                activeLayout == "group"
                  ? "/feed/create-group/new"
                  : `/feed/create-post/new`
              );
            }}>
            {activeLayout == "group" ? "Create Group" : "Create Post"}
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-6 items-center p-1 lg:p-4 mb-12 lg:mb-6'>
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
                  <Postcard
                    post={{
                      author: post.author.name,
                      authorId: post.author._id,
                      title: post.title,
                      description: post.description,
                      createdAt: post.createdAt,
                      id: post._id,
                      likeCount: post.likesCount,
                      commentCount: post.commentsCount,
                      likedByMe: post.likedByMe,
                      url: post.url || "",
                      image: post.image || "",
                      subTopic: post?.subTopic ?? null,
                      group: post?.group ?? null,
                      userImage: post?.author?.image || "",
                    }}
                    topic={topic?.toString() || ""}
                  />
                </React.Fragment>
              ))
            )
          ) : (
            <p className='text-gray-500 text-xs font-semibold'>
              {!isLoading ? "No posts found" : ""}
            </p>
          )
        ) : (
          <p className='text-gray-500'>No posts</p>
        )}

        <div ref={ref} className='h-1'></div>

        {isFetchingNextPage && <GlobalLoader />}
      </div>
    </>
  );
};
