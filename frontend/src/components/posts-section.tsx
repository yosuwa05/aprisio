"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import Postcard from "./postcard";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

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

export const PostsSection = () => {
  const pageParam = 0;

  const user = useGlobalAuthStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects" + user?.id],
      queryFn: () => {
        return _axios.get(`/post?page=${pageParam}&userId=${user?.id ?? ""}`);
      },
      initialPageParam: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    });

  return (
    <div className="flex flex-col gap-4 items-center">
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
          page.data.posts.length > 0 ? (
            page.data.posts.map((post: IPost, postIndex: number) => (
              <Postcard
                key={`${pageIndex}-${postIndex}`}
                post={{
                  author: post.author.name,
                  title: post.title,
                  description: post.description,
                  createdAt: post.createdAt,
                  id: post._id,
                  likeCount: post.likesCount,
                  commentCount: post.commentsCount,
                  likedByMe: post.likedByMe,
                  url: post.url ? post.url : "",
                  image: post.image ? post.image : "",
                }}
              />
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
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
};
