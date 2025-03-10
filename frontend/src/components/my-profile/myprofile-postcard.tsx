"use client";

import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { formatDate, makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PostShareModalWeb } from "../post/share-modal-web";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import MyProfileCommentSection from "./myprofile-comment-section";

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
  subTopic: any;
  group: any;
  userImage: string;
}

export default function MyProfilePostCard({ post }: { post: IPostCard }) {
  const [viewAllReplies, setViewAllReplies] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState("");

  const router = useRouter();

  const CloseDialog = () => {
    setDialogOpen(false);
  };

  const CloseDrawer = () => {
    setDrawerOpen(false);
  };

  const queryClient = useQueryClient();

  const user = useGlobalAuthStore((state) => state.user);
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await _axios.post("/authenticated/post/like", {
        postId: post.id,
      });
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
        }
      );

      return { previousPosts };
    },
    onError: (err, newPost, context: any) => {
      queryClient.setQueryData(
        ["my-profile-posts", user?.id, activeTab],
        context.previousPosts
      );
    },
    onSuccess: (data) => {
      if (data.data.ok) {
        if (data.data.message === "Post liked successfully") {
          toast("Post liked");
          queryClient.invalidateQueries({
            queryKey: ["my-profile-posts", user?.id, activeTab],
          });
        } else {
          toast("Post Unliked");
          queryClient.invalidateQueries({
            queryKey: ["my-profile-posts", user?.id, activeTab],
          });
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
            <AvatarImage
              className="object-cover rounded-full"
              src={BASE_URL + `/file?key=${post.userImage}`}
            />
            <AvatarFallback>{makeUserAvatarSlug(post.author)}</AvatarFallback>
          </Avatar>

          <div className="self-end">
            <h3
              className="text-textcol font-semibold text-xs cursor-pointer"
              onClick={() => {
                router.push("/user/" + post.author);
              }}
            >
              {post.author}
            </h3>
            <p className="text-[#043A53] text-xs font-medium">
              {post?.subTopic?.[0]?.subTopicName && (
                <Link href={`/feed/explore/${post.subTopic[0].slug}`}>
                  {post.subTopic[0].subTopicName}
                </Link>
              )}
              {post?.group?.[0]?.name && (
                <>
                  {" | "}
                  <Link
                    href={`/groups/${post.group[0].slug}`}
                    className="text-fadedtext"
                  >
                    {post.group[0].name}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="text-xs font-medium text-[#6B6D6D] flex items-center">
          {formatDate(post.createdAt)}

          {activeTab === "created-posts" && (
            <Button
              variant={"link"}
              onClick={() => {
                if (post?.group?.[0]?.name) {
                  router.push(`/edit-post/group/${post.id}`);
                } else {
                  router.push(`/feed/edit-post/${post.id}`);
                }
              }}
            >
              <Edit className="text-gray-600" size={14} />
            </Button>
          )}
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
          {/* <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className=''>
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
          </Drawer> */}
        </div>
      </div>

      <div>
        <MyProfileCommentSection
          postId={post.id}
          viewAllReplies={viewAllReplies}
          setViewAllReplies={setViewAllReplies}
        />
      </div>
    </div>
  );
}
