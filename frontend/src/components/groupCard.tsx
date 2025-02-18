"use client";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import personImage from "@img/assets/person.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface IGroupCard {
  name: string;
  createdAt: string;
  groupAdmin: IAdmin;
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

export default function GroupCard({ group }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (group: IGroup) => {
      return await _axios.post("/group/join", {
        groupId: group.id,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["groups" + user?.id, topic],
      });

      const previousGroups = queryClient.getQueryData([
        "groups" + user?.id,
        topic,
      ]);

      queryClient.setQueryData(["groups" + user?.id, topic], (old: any) => {
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
        queryClient.invalidateQueries({
          queryKey: ["groups" + user?.id, topic],
        });
      } else {
        toast.error(data.data.message || "Something went wrong");
      }
    },
  });

  return (
    <div
      className='p-2 w-full rounded-lg transition-all'
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      <div className='flex gap-2 w-full items-center justify-between  h-[70px]'>
        <div className='flex gap-4 items-center'>
          <Image
            src={personImage}
            alt='person'
            width={50}
            height={50}
            className='rounded-lg'
          />

          <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>{group.name}</h2>

            <div className='flex gap-6 items-center justify-between'>
              <p className='text-[#043A53] text-xs font-medium'>
                {group.memberCount} Member
              </p>
              <p className='text-gray-500 text-xs font-medium hidden lg:block'>
                <span className='hidden lg:block'>Created</span>{" "}
                {formatDate(group.createdAt)}
              </p>
              <p className='text-[#828485] text-xs font-medium'>
                Organized by{" "}
                <span className='font-bold text-[#636566]'>
                  {group.groupAdmin.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          disabled={isPending}
          className={`${
            group.canJoin
              ? "bg-[#F2F5F6] border-[#043A53]"
              : "bg-[#FCF7EA] border-[#AF9654]"
          } rounded-3xl border-[0.2px]  hover:bg-[#FCF7EA] text-black`}
          onClick={() => {
            if (group.canJoin) {
              mutate({
                id: group._id,
              });
            } else {
              router.push(`/groups/${group.slug}`);
            }
          }}>
          {group.canJoin ? "Join" : "View"}
        </Button>
      </div>
    </div>
  );
}
