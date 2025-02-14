"use client";

import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronsDown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import Comment from "./comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type Props = {
  postId: string;
  viewAllReplies?: boolean;
  setViewAllReplies?: any;
  topic: any;
};

type IComment = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

export default function CommentSection({
  postId,
  viewAllReplies,
  setViewAllReplies,
  topic,
}: Props) {
  const [typedComment, setTypedComment] = useState("");
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;
  const queryClient = useQueryClient();

  function handleSubmit() {
    mutate({ content: typedComment, postId, parentCommentId: undefined });
    setTypedComment("");
  }

  const { mutate } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/comment", data);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects" + user?.id] });

      const previousPosts = queryClient.getQueryData([
        "projects" + user?.id,
        topic,
      ]);

      queryClient.setQueryData(["projects" + user?.id, topic], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p: any) =>
                p._id === postId
                  ? {
                      ...p,
                      commentsCount: p.commentsCount + 1,
                    }
                  : p
              ),
            },
          })),
        };
      });

      return { previousPosts };
    },
    onSuccess(data) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
      if (!viewAllReplies) setViewAllReplies(!viewAllReplies);
      queryClient.invalidateQueries({
        queryKey: ["comments", user?.id],
      });
    },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/comment?postId=${postId}&userId=${
            user?.id ?? ""
          }&page=${pageParam}&limit=${limit}`
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.comments?.length === limit ? nextPage : undefined;
      },
    });

  return (
    <div>
      <div className="mt-4 flex gap-4 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/assets/person.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Input
          placeholder="Write your comment"
          className="border-none bg-contrastbg text-[#828485] placeholder:text-xs font-semibold"
          value={typedComment}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          onChange={(e) => setTypedComment(e.target.value)}
        />
      </div>

      {viewAllReplies && !isLoading && (
        <motion.div className="mt-4 flex flex-col gap-6">
          {data?.pages?.flatMap((page) =>
            page?.comments?.map((comment: any, index: number) => (
              <React.Fragment key={comment._id}>
                <Comment
                  comment={comment}
                  viewAllReplies={viewAllReplies}
                  postId={postId}
                />
              </React.Fragment>
            ))
          )}

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="ghost"
                size="icon"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ChevronsDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
