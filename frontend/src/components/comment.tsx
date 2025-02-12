import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
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
      console.log(data, "newone");
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

      console.log(previousComments);

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
      className='lg:w-[90%] lg:ml-auto w-[85%] ml-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
      }}>
      <div className='flex items-center gap-6 justify-between'>
        <div className='flex gap-2'>
          <Avatar className='w-5 h-5'>
            <AvatarImage src='/assets/person.png' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='self-center'>
            <h3 className='text-textcol font-semibold text-sm'>
              {comment.user.name}
            </h3>
          </div>
        </div>
        <p className='text-xs font-medium text-[#6B6D6D] self-center'>
          {formatDate(comment.createdAt)}
        </p>
      </div>
      <div className='ml-6 py-2'>
        {comment.content && (
          <p className='font-normal text-xs lg:text-sm'>
            {comment?.parentComment && comment.parentComment.user ? (
              <span className='text-sky-500'>
                {comment.parentComment.user.name}
              </span>
            ) : (
              ""
            )}{" "}
            {comment.content}
          </p>
        )}
      </div>
      <div className='flex gap-2 lg:gap-3'>
        <div className='flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1  hover:border-[1px] border-[1px] border-gray-200'>
          <Icon
            icon={comment.likedByMe ? "mage:heart-fill" : "mage:heart"}
            className={`h-4 w-4 cursor-pointer ${
              comment.likedByMe ? "text-red-500" : "text-gray-500"
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
          <p className='text-xs text-gray-500'>{comment.likesCount}</p>
        </div>
        {/* <div className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 hover:bg-gray-100 hover:border-[1px] border-[1px] border-transparent hover:border-gray-200 cursor-pointer">
          <Icon
            className="h-4 w-4 lg:h-5 lg:w-5 cursor-pointer"
            icon="basil:comment-outline"
            color="black"
            onClick={() => setIsReplyOpened(!isReplyOpened)}
          />
          <p className="text-xs lg:text-sm">{0}</p>
        </div> */}

        <div
          className='flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 hover:border-[1px] border-[1px] border-transparent hover:border-gray-200 cursor-pointer'
          onClick={() => setIsReplyOpened(!isReplyOpened)}>
          <Icon
            icon='uil:share'
            className='h-4 w-4 cursor-pointer text-gray-500'
          />
          <p className='text-xs text-gray-500'>{"Reply"}</p>
        </div>
      </div>

      <AnimatePresence>
        {isReplyOpened && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className='mt-4 flex gap-4 items-center'>
            <Avatar className='h-6 w-6'>
              <AvatarImage src='/assets/person.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Input
              placeholder='Write your reply'
              className='border-none bg-contrastbg text-[#828485] placeholder:text-sm'
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
