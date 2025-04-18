"use client";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IGroupCard {
  name: string;
  createdAt: string;
  userId: IAdmin;
  group: any;
  canJoin: boolean;
  slug: string;
  memberCount: number;
  _id: string;
}

interface IAdmin {
  name: string;
}

interface Props {
  group: IGroupCard;
}

interface IGroup {
  id: String;
}

export function PersonalGroupCard({ group }: Props) {
  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (group: IGroup) => {
      return await _axios.post("/group/join", {
        groupId: group.id,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["groups" + user?.id] });

      const previousGroups = queryClient.getQueryData(["groups" + user?.id]);

      queryClient.setQueryData(["groups" + user?.id], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              groups: page.data.groups.map((g: any) =>
                g._id === group._id ? { ...g, canJoin: false } : g
              ),
            },
          })),
        };
      });

      return { previousGroups };
    },
    onSuccess: (data) => {
      if (data.data.ok) {
        toast(data.data.message || "Joined group successfully");
      } else {
        toast.error(data.data.message || "Something went wrong");
      }
    },
  });

  return (
    <div
      className="p-2 w-full rounded-lg transition-all"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex gap-2 w-full items-center justify-between  h-[70px]">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-2 ml-4">
            <h2 className="font-semibold">{group?.group?.name}</h2>

            <div className="flex gap-6 items-center justify-between">
              <p className="text-[#043A53] text-xs font-medium">
                {group?.group?.memberCount}
                {group?.group?.memberCount > 1 ? " members" : " member"}
              </p>
              <p className="text-gray-500 text-xs font-medium">
                Created {formatDate(group.createdAt)}
              </p>
              <p className="text-[#828485] text-xs font-medium">
                Organized by{" "}
                <span className="font-bold text-[#636566]">
                  {group.userId.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          disabled={isPending}
          className={`${
            group?.canJoin
              ? "bg-[#F2F5F6] border-[#043A53]"
              : "bg-[#FCF7EA] border-[#AF9654]"
          } rounded-3xl border-[0.2px]  hover:bg-[#FCF7EA] text-black`}
          onClick={() => {
            if (group.canJoin) {
              mutate({
                id: group._id,
              });
            } else {
              router.push(`/groups/${group?.group?.slug}`);
            }
          }}
        >
          {group.canJoin ? "Join" : "View"}
        </Button>
      </div>
    </div>
  );
}
