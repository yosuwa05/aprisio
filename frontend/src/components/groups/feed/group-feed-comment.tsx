import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { formatDate, makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
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

export default function GroupFeedComment({ comment, postId }: Props) {
  const [repliedContent, setRepliedContent] = useState("");
  const [isReplyOpened, setIsReplyOpened] = useState(false);

  const queryClient = useQueryClient();

  const user = useGlobalAuthStore((state) => state.user);

  const { mutate: likeMutation, isPending: isLikePending } = useMutation({
    mutationFn: async (data: ICommentLike) => {
      return await _axios.post("/comment/like", data);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["comments", user?.id, postId],
      });

      const previousComments = queryClient.getQueryData([
        "comments",
        user?.id,
        postId,
      ]);

      queryClient.setQueryData(["comments", user?.id, postId], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            comments: page.comments.map((c: any) =>
              c._id === comment._id
                ? {
                    ...c,
                    likesCount: !c.likedByMe
                      ? c.likesCount + 1
                      : c.likesCount - 1,
                    likedByMe: !c.likedByMe,
                  }
                : c
            ),
          })),
        };
      });

      return { previousComments };
    },

    onSuccess(data) {
      if (data.data.ok) {
        toast.success(data.data.message || "Comment liked successfully");
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
        queryKey: ["comments", user?.id, postId],
      });
    },
  });

  function handleReplySubmit(commentID: string) {
    mutate({ content: repliedContent, postId, parentCommentId: commentID });
    setRepliedContent("");
    setIsReplyOpened(false);
  }

  return (
    <motion.div className="lg:w-[90%] lg:ml-auto w-[85%] ml-auto">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex gap-2">
          <Avatar className="h-5 w-5 object-cover">
            <AvatarImage src={BASE_URL + `/file?key=${comment?.user?.image}`} />
            <AvatarFallback className="text-xs">
              {makeUserAvatarSlug(comment?.user?.name ?? "")}
            </AvatarFallback>
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
      <div className="flex gap-2 lg:gap-3">
        <div className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1  hover:border-[1px] border-[1px] border-gray-200">
          <Icon
            icon={comment.likedByMe ? "mage:heart-fill" : "mage:heart"}
            className={`h-4 w-4 cursor-pointer ${
              comment.likedByMe ? "text-red-500" : "text-gray-800"
            }`}
            onClick={() => {
              if (isLikePending) return;

              if (!user) {
                toast("Login to like");
                return;
              }
              likeMutation({ commentId: comment._id });
            }}
          />
          <p className="text-xs text-gray-500">{comment.likesCount}</p>
        </div>

        <div
          className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 hover:border-[1px] border-[1px] border-transparent hover:border-gray-200 cursor-pointer"
          onClick={() => setIsReplyOpened(!isReplyOpened)}
        >
          <Icon
            icon="uil:share"
            className="h-4 w-4 cursor-pointer text-gray-500"
          />
          <p className="text-xs text-gray-500">{"Reply"}</p>
        </div>
      </div>

      <div>
        {isReplyOpened && (
          <motion.div className="mt-4 flex gap-4 items-center">
            <Avatar className="h-9 w-9 object-cover">
              <AvatarImage src={BASE_URL + `/file?key=${user?.image}`} />
              <AvatarFallback>
                {makeUserAvatarSlug(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>

            <Input
              placeholder="Write your reply"
              className="border-none bg-contrastbg text-[#535455] placeholder:text-sm"
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
      </div>
    </motion.div>
  );
}
