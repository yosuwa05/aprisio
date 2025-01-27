"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import Postcard from "./postcard";
import { Button } from "./ui/button";

export const PostsSection = () => {
  const pageParam = 0;

  const user = useGlobalAuthStore((state) => state.user);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects" + user?.id],
    queryFn: () => {
      return _axios.get(`/post?page=${pageParam}&userId=${user?.id ?? ""}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      {data?.pages.map((page, pageIndex) =>
        page.data.posts.map((post: any, postIndex: number) => (
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
