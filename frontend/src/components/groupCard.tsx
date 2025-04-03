"use client";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import useGroupStore from "@/stores/edit-section/GroupStrore";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
interface IGroupCard {
  name: string;
  description: string;
  createdAt: string;
  groupAdmin: IAdmin;
  canJoin: boolean;
  slug: string;
  memberCount: number;
  _id: string;
  subTopic: {
    _id: string;
    slug: string;
  };
}

interface IAdmin {
  name: string;
  _id: string;
}

interface Props {
  group: IGroupCard;
}

interface IGroup {
  id: string;
}

export default function GroupCard({ group }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<string>("");
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
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

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async () => {
      let res = await _axios.delete(
        `/delete-management/group?groupId=${groupId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Group deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["my-profile-created-groups", user?.id, activeTab],
      });
      queryClient.invalidateQueries({
        queryKey: ["groups" + user?.id, topic],
      });
      setDeleteOpen(false);
      setGroupId("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An Error Occured");
      setGroupId("");
      setDeleteOpen(false);
    },
  });

  return (
    <div className='p-2 w-full rounded-lg transition-all shadow-md'>
      <div className='flex flex-col sm:flex-row gap-2 w-full items-start sm:items-center justify-between h-auto sm:h-[70px]'>
        <div className='flex flex-col sm:flex-row gap-4 items-start w-full'>
          <div className='flex flex-col gap-2 pl-4'>
            <h2
              onClick={() => router.push(`/groups/${group?.slug}`)}
              className='font-semibold text-base cursor-pointer text-left'>
              {group?.name}
            </h2>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center justify-between'>
              <p className='text-[#043A53] text-xs font-medium text-left'>
                {group?.memberCount + 1} Member
              </p>
              <p className='text-gray-500 text-xs font-medium '>
                <span>Created</span> {formatDate(group?.createdAt)}
              </p>
              <p className='text-[#828485] text-xs font-medium text-left'>
                Organized by{" "}
                <span className='font-bold text-[#636566] cursor-pointer'>
                  <Link href={`/user/${group?.groupAdmin?.name}`}>
                    {group?.groupAdmin?.name}
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-4 w-full sm:w-auto'>
          <Button
            onClick={() => router.push(`/groups/${group.slug}`)}
            className='rounded-3xl border-[0.2px] bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] text-black w-full sm:w-auto'>
            View
          </Button>

          {user && group?.groupAdmin?._id === user?.id ? (
            <Button
              onClick={() => {
                useGroupStore.getState().setCurrentGroup({
                  name: group.name,
                  description: group.description,
                  groupId: group._id,
                  subTopic: {
                    _id: group.subTopic._id,
                    slug: group.subTopic.slug,
                  },
                });
                router.push("/edit-group");
              }}
              className='rounded-3xl border-[0.2px] bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] text-black w-full sm:w-auto'>
              Edit
            </Button>
          ) : user && group.canJoin ? (
            <Button
              disabled={isPending}
              onClick={() => mutate({ id: group._id })}
              className='rounded-3xl border-[0.2px] bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] text-black w-full sm:w-auto'>
              Join
            </Button>
          ) : null}
          {group?.groupAdmin?._id === user?.id && (
            <Button
              onClick={() => {
                setDeleteOpen(true);
                setGroupId(group?._id);
              }}
              className='rounded-3xl border-[0.2px] bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] text-black w-full sm:w-auto'>
              Delete
            </Button>
          )}
        </div>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Group and all its associated data including events, posts, photos
              and comments from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setGroupId("");
              }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePending}
              onClick={() => {
                deleteMutate();
              }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
