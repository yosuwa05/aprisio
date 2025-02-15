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
import { Button } from "../ui/button";
import EventComment from "./event-comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  eventId: string;
  viewAllReplies?: boolean;
  setViewAllReplies?: any;
  // topic: any;
};

type IComment = {
  content: string;
  eventId: string;
  parentCommentId?: string;
};

export default function EventCommentSection({
  eventId,
  viewAllReplies,
  setViewAllReplies,
}: // topic,
Props) {
  const [typedComment, setTypedComment] = useState("");
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;
  const queryClient = useQueryClient();

  function handleSubmit() {
    mutate({ content: typedComment, eventId, parentCommentId: undefined });
    setTypedComment("");
  }

  const { mutate } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/event-comment", data);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects" + user?.id] });

      const previousPosts = queryClient.getQueryData([
        "projects" + user?.id,
        // topic,
      ]);

      queryClient.setQueryData(["projects" + user?.id], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p: any) =>
                p._id === eventId
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
        queryKey: ["event-comments", user?.id, eventId],
      });
    },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["event-comments", user?.id, eventId],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/event-comment?eventId=${eventId}&userId=${
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

  console.log(data);
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

      {viewAllReplies && !isLoading && (
        <motion.div className='mt-4 flex flex-col gap-6'>
          {data?.pages?.flatMap((page) =>
            page?.comments?.map((comment: any, index: number) => (
              <React.Fragment key={comment._id}>
                <EventComment
                  comment={comment}
                  viewAllReplies={viewAllReplies}
                  eventId={eventId}
                />
              </React.Fragment>
            ))
          )}

          {hasNextPage && (
            <div className='flex justify-start'>
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant='ghost'>
                See More
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
