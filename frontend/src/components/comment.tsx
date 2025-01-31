import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  comment: any;
  postId: string;
  viewAllReplies?: boolean;
}
type ICommentLike = {
  commentId: string;
};

type IComment = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

export default function Comment({ comment, postId, viewAllReplies }: Props) {
  const [repliedContent, setRepliedContent] = useState("");
  const [isReplyOpened, setIsReplyOpened] = useState(false);

  const queryClient = useQueryClient();

  const user = useGlobalAuthStore((state) => state.user);

  const { mutate: likeMutation, isPending: isLikePending } = useMutation({
    mutationFn: async (data: ICommentLike) => {
      return await _axios.post("/comment/like", data);
    },
    onMutate: async (data: ICommentLike) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", viewAllReplies, postId, user?.id],
      });

      const previousComments = queryClient.getQueryData([
        "comments",
        viewAllReplies,
        postId,
        user?.id,
      ]);

      queryClient.setQueryData(
        ["comments", viewAllReplies, postId, user?.id],
        (old: any) => {
          return {
            ...old,
            comments: old.comments.map((comment: any) =>
              comment._id === data.commentId
                ? {
                    ...comment,
                    likesCount: !comment.likedByMe
                      ? comment.likesCount + 1
                      : comment.likesCount - 1,
                    likedByMe: !comment.likedByMe,
                  }
                : comment
            ),
          };
        }
      );

      return { previousComments };
    },
    onSuccess(data) {
      toast.success(data.data.message);
      if (data.data.ok) {
        queryClient.invalidateQueries({
          queryKey: ["comments", viewAllReplies, postId, user?.id],
        });
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/comment", data);
    },
    onSuccess(data) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
      queryClient.invalidateQueries({
        queryKey: ["comments", viewAllReplies, postId, user?.id],
      });
    },
  });

  function handleReplySubmit(commentID: string) {
    mutate({ content: repliedContent, postId, parentCommentId: commentID });
    setRepliedContent("");
    setIsReplyOpened(false);
  }

  return (
    <motion.div
      key={comment._id}
      className=" w-[80%] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
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
            {comment?.parentComment && comment.parentComment.user ? (
              <span className="text-sky-500">
                {comment.parentComment.user.name}
              </span>
            ) : (
              ""
            )}{" "}
            {comment.content}
          </p>
        )}
      </div>
      <div className="flex gap-2 lg:gap-3 w-[95%] mx-auto">
        <div className="flex gap-2 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
          <Heart
            className="h-4 w-4 cursor-pointer "
            fill={comment.likedByMe ? "red" : "white"}
            color={comment.likedByMe ? "red" : "black"}
            onClick={() => {
              if (isLikePending) return;
              if (!user) {
                toast("Login to like");
                return;
              }
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

        <div
          className="flex gap-2 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1 cursor-pointer"
          onClick={() => setIsReplyOpened(!isReplyOpened)}
        >
          <Image
            className="h-5 w-5"
            width={20}
            height={20}
            src="/assets/share.svg"
            alt=""
          />
          <p className="text-xs lg:text-xs">Reply</p>
        </div>
      </div>

      <AnimatePresence>
        {isReplyOpened && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-4 flex gap-4 items-center"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src="/assets/person.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Input
              placeholder="Write your reply"
              className="border-none bg-contrastbg text-[#828485] placeholder:text-sm"
              value={repliedContent}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleReplySubmit(comment._id);
                }
              }}
              onChange={(e) => setRepliedContent(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
