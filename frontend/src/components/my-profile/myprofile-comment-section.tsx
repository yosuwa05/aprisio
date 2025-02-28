"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import MyProfileComment from "./myprofile-posts-comment";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";

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

export default function MyProfileCommentSection({
  postId,
  viewAllReplies,
  setViewAllReplies,
}: Props) {
  const [typedComment, setTypedComment] = useState("");
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 4;
  const queryClient = useQueryClient();
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

  function handleSubmit() {
    mutate({ content: typedComment, postId, parentCommentId: undefined });
    setTypedComment("");
  }

  const { mutate } = useMutation({
    mutationFn: async (data: IComment) => {
      return await _axios.post("/comment", data);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["my-profile-posts", user?.id, activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        "my-profile-posts",
        user?.id,
        activeTab,
      ]);

      queryClient.setQueryData(
        ["my-profile-posts", user?.id, activeTab],
        (old: any) => {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: any) =>
                p._id === postId
                  ? {
                      ...p,
                      commentsCount: p.commentsCount + 1,
                    }
                  : p
              ),
            })),
          };
        }
      );
      return { previousPosts };
    },
    onSuccess(data) {
      if (!data.data.ok) return toast.error(data.data.message);

      toast.success("Comment added");
      if (!viewAllReplies) setViewAllReplies(!viewAllReplies);
      queryClient.invalidateQueries({
        queryKey: ["comments", user?.id, postId],
      });
    },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", user?.id, postId],
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
        <Avatar className="h-9 w-9 object-cover">
          <AvatarImage src={BASE_URL + `/file?key=${user?.image}`} />
          <AvatarFallback>
            {makeUserAvatarSlug(user?.name ?? "")}
          </AvatarFallback>
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
                <MyProfileComment
                  comment={comment}
                  viewAllReplies={viewAllReplies}
                  postId={postId}
                />
              </React.Fragment>
            ))
          )}

          {hasNextPage && (
            <div className="flex justify-start">
              <Button
                className=" text-contrasttext"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="ghost"
              >
                See More
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
