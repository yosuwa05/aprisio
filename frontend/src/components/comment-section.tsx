"use client";

import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  postId: string;
  viewAllReplies?: boolean;
};

type IComment = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

type ICommentLike = {
  commentId: string;
};

export default function CommentSection({ postId, viewAllReplies }: Props) {
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
    onSuccess(data, variables, context) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
      queryClient.invalidateQueries({
        queryKey: ["comments", viewAllReplies, postId],
      });
    },
  });

  const { mutate: likeMutation, isPending: isLikePending } = useMutation({
    mutationFn: async (data: ICommentLike) => {
      return await _axios.post("/comment/like", data);
    },
    onSuccess(data) {
      toast.success(data.data.message);

      if (data.data.ok) {
        queryClient.invalidateQueries({
          queryKey: ["comments", viewAllReplies, postId],
        });
      }
    },
  });

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await _axios.get(
        `/comment?postId=${postId}&userId=${user?.id}`
      );
      return res.data;
    },
    queryKey: ["comments", viewAllReplies, postId],
    staleTime: 0,
  });

  return (
    <div>
      <div className="mt-4 flex gap-4 items-center">
        <Avatar className="h-11 w-11">
          <AvatarImage src="/assets/person.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Input
          placeholder="Write your comment"
          className="border-none bg-contrastbg text-[#828485] placeholder:text-sm"
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
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {data?.comments.map((comment: any) => (
              <motion.div
                key={comment._id}
                className=" w-[80%] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1 * data.comments.indexOf(comment),
                }}
              >
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="/assets/person.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="self-center">
                      <h3 className="text-textcol font-semibold text-sm">
                        {comment.user.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#6B6D6D] self-center">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <div className="ml-6 py-2">
                  {comment.content && (
                    <p className="font-normal text-xs lg:text-sm">
                      {comment.content}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 lg:gap-3 w-[95%] mx-auto">
                  <div className="flex gap-2 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
                    <Heart
                      className="h-4 w-4 cursor-pointer "
                      onClick={() => {
                        if (isLikePending) return;
                        likeMutation({ commentId: comment._id });
                      }}
                    />
                    <p className="text-xs lg:text-sm">{comment.likesCount}</p>
                  </div>
                  <div className="flex gap-2 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
                    <Image
                      width={20}
                      height={20}
                      className="h-4 w-4"
                      src="/assets/message.svg"
                      alt=""
                    />
                    <p className="text-xs lg:text-sm">{0}</p>
                  </div>
                  <div className="flex gap-2 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
                    <Image
                      className="h-5 w-5"
                      width={20}
                      height={20}
                      src="/assets/share.svg"
                      alt=""
                    />
                    <p className="text-xs lg:text-xs">Share</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div></div>
        )}
      </AnimatePresence>
    </div>
  );
}
