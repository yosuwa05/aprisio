"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import Postcard from "./postcard";
import { Button } from "./ui/button";

export const PostsSection = () => {
  const pageParam = 0;

  const user = useGlobalAuthStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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
      {data && data.pages && data?.pages.length > 0 ? (
        data.pages.map((page, pageIndex) =>
          page.data.posts.length > 0 ? (
            page.data.posts.map((post, postIndex: number) => (
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
