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
}

export function TopicsCard({
  subTopicName,
  description,
  subTopicId,
  joined,
  slug,
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
      } else {
        toast.error(data.error);
      }
    },
    onMutate: async ({ subTopicId }) => {
      await queryClient.cancelQueries({ queryKey: ["community", user?.id] });

      const previousTopics = queryClient.getQueryData(["community", user?.id]);

      queryClient.setQueryData(["community", user?.id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              topics: page.data.topics.map((topic: any) => ({
                ...topic,
                subTopic: topic.subTopic.map((subTopic: any) =>
                  subTopic._id === subTopicId
                    ? { ...subTopic, joined: true }
                    : subTopic
                ),
              })),
            },
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
    <div className="w-[350px] border-[1px] border-[#C0C0C0] rounded-xl p-4 cursor-pointer">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold capitalize">{subTopicName}</h2>

          <div className="flex gap-2">
            <p>300+ Groups</p>

            <p>200+ Events</p>
          </div>
        </div>

        <Button
          className={`${
            joined
              ? "bg-[#F2F5F6] border-[#043A53]"
              : "bg-[#FCF7EA] border-[#AF9654]"
          } rounded-3xl border-[0.2px]  hover:bg-[#FCF7EA] text-black`}
          disabled={isPending}
          onClick={() => {
            if (joined) {
              router.push(`/community/${slug}`);
              return;
            }
            if (!user) return toast.error("Login to join");
            if (!isPending) {
              handleClick();
            }
          }}
        >
          {joined ? "View" : "Join"}
        </Button>
      </div>

      <p className="text-xs text-[#828485] mt-2 font-normal leading-4">
        {description}
      </p>
    </div>
  );
}
