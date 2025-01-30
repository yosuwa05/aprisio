import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import CommentSection from "./comment-section";

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
}

function formatDate(date: string) {
  const now = new Date();
  const givenDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - givenDate.getTime()) / 1000
  );

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "seconds");
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, "minutes");
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, "hours");
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, "days");
  }
}

export default function Postcard({ post }: { post: IPostCard }) {
  const queryClient = useQueryClient();

  const user = useGlobalAuthStore((state) => state.user);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await _axios.post("/authenticated/post/like", {
        postId: post.id,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects" + user?.id] });

      const previousPosts = queryClient.getQueryData(["projects" + user?.id]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["projects" + user?.id], (old: any) => {
        return {
          ...old,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              posts: page.data.posts.map((p: any) =>
                p._id === post.id
                  ? {
                      ...p,
                      likesCount: !p.likedByMe
                        ? p.likesCount + 1
                        : p.likesCount - 1,
                      likedByMe: !p.likedByMe,
                    }
                  : p
              ),
            },
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, newPost, context: any) => {
      queryClient.setQueryData(["projects" + user?.id], context.previousPosts);
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
      className="p-4 lg:px-8 w-full rounded-lg"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="/assets/person.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="self-end">
            <h3 className="text-textcol font-semibold text-sm">
              {post.author}
            </h3>
            <p className="text-[#043A53] text-xs font-medium">300+ Members</p>
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
            <a href={post.url} target="_blank" rel="noreferrer">
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
        <div className="flex gap-2 lg:gap-6 justify-between">
          <div className="flex gap-1 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
            <Heart
              className="h-5 w-5 cursor-pointer"
              fill={post.likedByMe ? "red" : "white"}
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
            <p>{post.likeCount ?? 0}</p>
          </div>
          <div className="flex gap-1 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
            <Image
              width={20}
              height={20}
              className="h-5 w-5"
              src="/assets/message.svg"
              alt=""
            />
            <p>{post.commentCount ?? 0}</p>
          </div>
          <div className="flex gap-1 items-center font-semibold bg-[#FCF7EA] px-4 rounded-full py-1">
            <Image
              className="h-5 w-5"
              width={20}
              height={20}
              src="/assets/share.svg"
              alt=""
            />
            <p>Share</p>
          </div>
        </div>
        <p className="text-sm lg:text-md text-contrasttext">View All Replies</p>
      </div>

      <div>
        <CommentSection />
      </div>
    </div>
  );
}
