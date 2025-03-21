"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { formatDate, makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import CommentSection from "./comment-section";
import { PostShareModalMobile } from "./post/share-drawer-mobile";
import { PostShareModalWeb } from "./post/share-modal-web";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

interface IPostCard {
  title: string;
  description: string;
  author: string;
  createdAt: string;
  id: string;
  likedByMe?: boolean;
  likeCount?: number;
  commentCount?: number;
  url?: string;
  image?: string;
  userImage?: string;
}

export default function SharedPostcard({
  post,
  groupid,
}: {
  post: IPostCard;
  groupid: string;
}) {
  const [viewAllReplies, setViewAllReplies] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState("");

  const CloseDialog = () => {
    setDialogOpen(false);
  };

  const CloseDrawer = () => {
    setDrawerOpen(false);
  };

  const queryClient = useQueryClient();

  const user = useGlobalAuthStore((state) => state.user);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await _axios.post("/authenticated/post/like", {
        postId: post.id,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["shared-group-post", groupid],
      });

      const previousPosts = queryClient.getQueryData([
        "shared-group-post",
        groupid,
      ]);

      queryClient.setQueryData(["shared-group-post", groupid], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            sharedPosts: page.sharedPosts.map((p: any) =>
              p._id === post.id
                ? {
                    ...p,
                    ...p,
                    likesCount: !p.likedByMe
                      ? p.likesCount + 1
                      : p.likesCount - 1,
                    likedByMe: !p.likedByMe,
                  }
                : p
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, newPost, context: any) => {
      queryClient.setQueryData(
        ["shared-group-post", groupid],
        context.previousPosts
      );
    },
    onSuccess: (data) => {
      if (data.data.ok) {
        if (data.data.message === "Post liked successfully") {
          toast("Post liked");
        } else {
          toast("Post Unliked");
        }
      } else {
        toast("An error occurred while liking post");
      }
    },
  });

  return (
    <div
      className="p-4 lg:px-8 w-full rounded-lg transition-all"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={BASE_URL + `/file?key=${post.userImage}`} />
            <AvatarFallback>{makeUserAvatarSlug(post.author)}</AvatarFallback>
          </Avatar>

          <div className="self-end">
            <h3 className="text-textcol font-semibold text-xs">
              {post.author}
            </h3>
            <p className="text-[#043A53] text-xs font-medium">{groupid}</p>
          </div>
        </div>

        <p className="text-xs font-medium text-[#6B6D6D] self-center">
          {formatDate(post.createdAt)}
        </p>
      </div>

      <div className="mt-3">
        <h2 className="text-lg text-textcol font-semibold">{post.title}</h2>

        {post.description && (
          <p className="font-normal mt-2">{post.description}</p>
        )}

        {post.url && (
          <p className="font-normal mt-2 text-sky-500">
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="break-words"
            >
              {post.url}
            </a>
          </p>
        )}

        {post.image && (
          <div className="relative mt-2 w-full h-[400px] overflow-hidden rounded-lg bg-gray-200">
            <div className="absolute inset-2 bg-gray-100 blur-lg"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={BASE_URL + `/file?key=${post.image}`}
                alt=""
                width={500}
                height={500}
                priority={false}
                placeholder="empty"
                className="max-w-full max-h-full object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2 lg:gap-3 justify-between items-center">
          <div className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 bg-gray-50 border-[1px] border-gray-200">
            <Icon
              icon={post.likedByMe ? "mage:heart-fill" : "mage:heart"}
              className="h-4 w-4 lg:h-5 lg:w-5 cursor-pointer"
              color={post.likedByMe ? "red" : "black"}
              onClick={() => {
                if (isPending) return;
                if (!user) {
                  toast("Login to like");
                  return;
                }
                mutate();
              }}
            />

            <p className="text-xs lg:text-sm">{post.likeCount ?? 0}</p>
          </div>
          <div
            className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 bg-gray-50 border-[1px] border-gray-200  cursor-pointer"
            onClick={() => setViewAllReplies(!viewAllReplies)}
          >
            <Icon
              className="h-4 w-4 lg:h-5 lg:w-5"
              icon="basil:comment-outline"
              color="black"
            />
            <p className="text-xs lg:text-sm">{post.commentCount ?? 0}</p>
          </div>
          {/* for Dialog web */}
          <div
            onClick={() => {
              setPostId(post.id), setDialogOpen(true);
            }}
            className="hidden  md:flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 bg-gray-50 border-[1px] border-gray-200 cursor-pointer "
          >
            <Icon
              icon="uil:share"
              color="black"
              className="h-4 w-4 lg:h-5 lg:w-5 cursor-pointer"
            />
            <p className="text-xs lg:text-xs font-bold">{"Share"}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="min-w-[calc(60vw-100px)] h-[calc(70vh-4rem)]  flex flex-col ">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                {/* <DialogClose className='absolute bg-red-500 rounded-full  right-2 top-12'>
                  <div className='p-1'>
                    <Icon
                      icon='ic:baseline-close'
                      className='h-5 w-5 text-gray-600 hover:text-gray-800 cursor-pointer'
                    />
                  </div>
                </DialogClose> */}
              </DialogHeader>
              <PostShareModalWeb
                postId={postId}
                CloseDialog={CloseDialog}
                CloseDrawer={CloseDrawer}
              />
            </DialogContent>
          </Dialog>
          {/* for Drawer mobile */}
          <div
            onClick={() => {
              setPostId(post.id), setDrawerOpen(true);
            }}
            className="flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 bg-gray-50 border-[1px] border-gray-200 cursor-pointer md:hidden  "
          >
            <Icon
              icon="uil:share"
              color="black"
              className="h-4 w-4 lg:h-5 lg:w-5 cursor-pointer"
            />
            <p className="text-xs lg:text-xs font-bold">{"Share"}</p>
          </div>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="">
              <DrawerHeader>
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
              <PostShareModalMobile
                postId={postId}
                CloseDrawer={CloseDrawer}
                CloseDialog={CloseDialog}
              />
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div>
        <CommentSection
          postId={post.id}
          viewAllReplies={viewAllReplies}
          setViewAllReplies={setViewAllReplies}
          topic={groupid}
        />
      </div>
    </div>
  );
}
