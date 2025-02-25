"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GlobalLoader from "../globalloader";
import { Skeleton } from "../ui/skeleton";
import PersonalPostcard from "./personalFeedCard";

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
  subTopic?: any;
  group?: any;
};

export const PersonalFeedPosts = () => {
  const user = useGlobalAuthStore((state) => state.user);
  const isUserRoute = usePathname().includes("/user/");

  const { userslug } = useParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["personalfeed" + user?.id, userslug],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          !isUserRoute
            ? `/post/personal?page=${pageParam}&userId=${
                user?.id ?? ""
              }&createdByMe=${isUserRoute}`
            : `/post/personalprofile?page=${pageParam}&userId=${userslug}`
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
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-6 items-center p-1">
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
      ) : data && data.pages && data.pages.length > 0 ? (
        data.pages.some((page) => page.data.posts.length > 0) ? (
          data.pages.map((page, pageIndex) =>
            page.data.posts.map((post: IPost, postIndex: number) => (
              <React.Fragment key={`${pageIndex}-${postIndex}`}>
                <PersonalPostcard
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
                    subTopic: post?.subTopic ?? null,
                    group: post?.group ?? null,
                  }}
                  topic={"technology"?.toString() || ""}
                />
              </React.Fragment>
            ))
          )
        ) : (
          <p className="text-gray-500 text-xs font-semibold">No posts found</p>
        )
      ) : (
        <p className="text-gray-500">No posts</p>
      )}

      <div ref={ref} className="h-1"></div>

      {isFetchingNextPage && <GlobalLoader />}
    </div>
  );
};
