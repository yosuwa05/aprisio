"use client";

import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import EventComment from "./event-comment";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";

type Props = {
  eventId: string;
};

type IComment = {
  content: string;
  eventId: string;
  parentCommentId?: string;
};

export default function EventCommentSection({ eventId }: Props) {
  const [typedComment, setTypedComment] = useState("");
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;
  const queryClient = useQueryClient();

  function handleSubmit() {
    if (!user) {
      toast.error("Please login to comment on events");
      setTypedComment("");
      return;
    }
    if (!typedComment.trim()) return toast.error("Comment cannot be empty");
    mutate({ content: typedComment, eventId, parentCommentId: undefined });
    setTypedComment("");
  }

  const { mutate } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/event-comment", data);
    },
    onSuccess(data) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
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

  return (
    <>
      <div className='border border-[#043A53] rounded-lg p-4 bg-white shadow-sm'>
        <div className='pb-3 flex items-center gap-2'>
          <Avatar className='h-10 w-10 border-2 border-gray-200'>
            <AvatarImage src={BASE_URL + `/file?key=${user?.image}`} />
            <AvatarFallback>
              {makeUserAvatarSlug(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className='text-black text-sm'>{user?.name}</span>
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <div className='flex-1 flex flex-col gap-2'>
            <Input
              placeholder='Write your comment...'
              className='border border-[#043a5350] rounded-lg p-2 focus:outline-none '
              value={typedComment}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              onChange={(e) => setTypedComment(e.target.value)}
            />
            <div className='flex gap-2 items-center'>
              {/* <Button
              variant="ghost"
              className="text-sm font-bold text-gray-600 hover:bg-gray-100"
              onClick={() => setTypedComment((prev) => `**${prev}**`)}
            >
              B
            </Button>
            <Button
              variant="ghost"
              className="text-sm italic text-gray-600 hover:bg-gray-100"
              onClick={() => setTypedComment((prev) => `_${prev}_`)}
            >
              I
            </Button>
            */}
              <Button
                onClick={handleSubmit}
                disabled={!typedComment.trim()}
                className='ml-auto bg-buttoncol text-[#1F1F1F] hover:bg-buttoncol'>
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
      {!isLoading && (
        <motion.div className='mt-10 flex flex-col  gap-6 '>
          {data?.pages?.flatMap((page) =>
            page?.comments?.map((comment: any, index: number) => (
              <React.Fragment key={comment._id}>
                <EventComment comment={comment} eventId={eventId} />
              </React.Fragment>
            ))
          )}

          {hasNextPage && (
            <div className='flex justify-start'>
              <Button
                className='text-blue-500 hover:bg-blue-50'
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant='ghost'>
                See More
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
