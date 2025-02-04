"use client";

import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import Comment from "./comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await _axios.get(
        `/comment?postId=${postId}&userId=${user?.id ?? ""}`
      );
      return res.data;
    },
    queryKey: ["comments", viewAllReplies, postId, user?.id],
    staleTime: 0,
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

      <AnimatePresence>
        {viewAllReplies && !isLoading && data?.comments.length > 0 ? (
          <motion.div
            className="mt-4 flex flex-col gap-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {data?.comments.map((comment: any) => (
              <React.Fragment key={comment._id}>
                <Comment
                  comment={comment}
                  viewAllReplies={viewAllReplies}
                  postId={postId}
                />
              </React.Fragment>
            ))}
          </motion.div>
        ) : (
          <div></div>
        )}
      </AnimatePresence>
    </div>
  );
}
