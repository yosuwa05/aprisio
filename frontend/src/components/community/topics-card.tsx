"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
  subTopicName: string;
  description: string;
  subTopicId: string;
  joined: string;
  slug: string;
  groupCount: number;
  totalEvents: number;
  totalPosts: number;
}

export function TopicsCard({
  subTopicName,
  description,
  subTopicId,
  joined,
  slug,
  groupCount,
  totalEvents,
  totalPosts,
}: Props) {
  const user = useGlobalAuthStore((state) => state.user);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: joinMutation, isPending } = useMutation({
    mutationKey: ["join-community"],
    mutationFn: async ({ subTopicId }: { subTopicId: string }) => {
      const res = await _axios.post(`/community/join`, {
        subTopicId,
        userId: user?.id ?? "",
      });
      return res;
    },
    onSuccess: ({ data }) => {
      if (data.ok) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["joined"],
        });
        queryClient.invalidateQueries({
          queryKey: ["community", user?.id],
        });
      } else {
        toast.error(data.error);
      }
    },
    onMutate: async ({ subTopicId }) => {
      await queryClient.cancelQueries({ queryKey: ["community", user?.id] });

      const previousTopics = queryClient.getQueryData(["community", user?.id]);

      if (!previousTopics) return { previousTopics };

      queryClient.setQueryData(["community", user?.id], (old: any) => {
        if (!old || !old.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            topics: page.topics.map((topic: any) => ({
              ...topic,
              subTopic: topic.subTopic.map((subTopic: any) =>
                subTopic._id === subTopicId
                  ? { ...subTopic, joined: true }
                  : subTopic
              ),
            })),
          })),
        };
      });

      return { previousTopics };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTopics) {
        queryClient.setQueryData(
          ["community", user?.id],
          context.previousTopics
        );
      }
      toast.error("Failed to join the community. Please try again.");
    },
  });

  const handleClick = () => {
    joinMutation({
      subTopicId,
    });
  };

  return (
    <div
      onClick={() => {
        router.push(`/feed/explore/${slug}`);
      }}
      className={` border-[1px] border-[#C0C0C0] ${
        joined ? "border-buttoncol border-[2px]" : ""
      }  rounded-xl p-4 cursor-pointer`}>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2'>
          <h2
            className='text-xl text-textcol font-bold capitalize cursor-pointer'
            onClick={() => {
              router.push(`/feed/explore/${slug}`);
              queryClient.invalidateQueries({
                queryKey: ["community-info", slug, user?.id],
              });
            }}>
            {subTopicName}
          </h2>

          <div className='flex gap-2'>
            {groupCount > 0 || totalPosts > 0 ? (
              <>
                {totalPosts > 0 && (
                  <p className='text-contrasttext font-sans font-medium'>
                    {totalPosts}+ Posts
                  </p>
                )}
                {groupCount > 0 && (
                  <p className='text-[#828485] font-sans font-medium'>
                    {groupCount}+ Groups
                  </p>
                )}
              </>
            ) : (
              <p className='text-[#828485] font-sans font-medium'>
                Get Started
              </p>
            )}
          </div>
        </div>

        <Button
          className={`rounded-3xl border-[0.2px] text-black transition-all duration-500
            ${
              joined
                ? "bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]"
                : "bg-[#FCF7EA] border-[#AF9654] hover:bg-[#F2F5F6] hover:border-[#043A53]"
            }
          `}
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            if (joined) {
              router.push(`/feed/explore/${slug}`);
              return;
            }
            if (!user) return toast.error("Login to join");
            if (!isPending) {
              handleClick();
            }
          }}>
          {joined ? "View" : "Join"}
        </Button>
      </div>

      <p className='text-xs text-[#828485] mt-2 font-normal leading-4'>
        {description}
      </p>
    </div>
  );
}
