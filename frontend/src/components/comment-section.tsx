"use client";

import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import Comment from "./comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronsDown, Loader2 } from "lucide-react";

type Props = {
  postId: string;
  viewAllReplies?: boolean;
  setViewAllReplies?: any;
};

type IComment = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

type ICommentLike = {
  commentId: string;
};

export default function CommentSection({
  postId,
  viewAllReplies,
  setViewAllReplies,
}: Props) {
  const [typedComment, setTypedComment] = useState("");
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;
  const queryClient = useQueryClient();

  function handleSubmit() {
    mutate({ content: typedComment, postId, parentCommentId: undefined });
    setTypedComment("");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/comment", data);
    },
    onSuccess(data) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
      setViewAllReplies(!viewAllReplies);
      queryClient.invalidateQueries({
        queryKey: ["comments", viewAllReplies, postId, user?.id],
      });
    },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", postId, user?.id],
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
      <div className='mt-4 flex gap-4 items-center'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src='/assets/person.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Input
          placeholder='Write your comment'
          className='border-none bg-contrastbg text-[#828485] placeholder:text-xs font-semibold'
          value={typedComment}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          onChange={(e) => setTypedComment(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {viewAllReplies && !isLoading && (
          <motion.div
            className='mt-4 flex flex-col gap-6'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            {data?.pages?.flatMap((page) =>
              page?.comments?.map((comment: any) => (
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
              <div className='flex justify-center'>
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant='ghost'
                  size='icon'>
                  {isFetchingNextPage ? (
                    <Loader2 className='h-5 w-5 animate-spin' />
                  ) : (
                    <ChevronsDown className='h-5 w-5' />
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
