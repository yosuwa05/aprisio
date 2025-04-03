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
interface IEventCard {
  eventName: string;
  createdAt: string;
  group: IGroup;
  managedBy: IManagedBy;
  isApprovedByAdmin: boolean;
  _id: string;
}

interface IGroup {
  name: string;
  _id: string;
}
interface IManagedBy {
  name: string;
  _id: string;
}
interface Props {
  event: IEventCard;
}

export default function EventApprovalCard({ event }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>("");
  const [approveEventID, setApproveEventd] = useState<string>("");
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await _axios.put(
        `/myprofile/approve-event/?eventId=${approveEventID}`
      );
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Event Approved ");
      queryClient.invalidateQueries({
        queryKey: ["my-profile-apprroval-events", user?.id, activeTab],
      });
    },
    onError(error: any) {
      console.log(error);
      setApproveEventd("");
    },
  });
  const { mutate: rejectMutate, isPending: rejectPending } = useMutation({
    mutationFn: async () => {
      let res = await _axios.delete(
        `/myprofile/reject-event/?eventId=${eventId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Event Rejected");

      queryClient.invalidateQueries({
        queryKey: ["my-profile-apprroval-events", user?.id, activeTab],
      });

      setDeleteOpen(false);
      setEventId("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An Error Occured");
      setEventId("");
      setDeleteOpen(false);
    },
  });

  return (
    <div className='p-2 w-full rounded-lg transition-all shadow-md'>
      <div className='flex flex-col sm:flex-row gap-2 w-full items-start sm:items-center justify-between h-auto sm:h-[70px]'>
        <div className='flex flex-col sm:flex-row gap-4 items-start w-full'>
          <div className='flex flex-col gap-2 pl-4'>
            <h2
              onClick={() => {
                router.push(`/events/${event?._id}`);
              }}
              className='font-semibold text-base cursor-pointer text-left'>
              {event?.eventName}
            </h2>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center justify-between'>
              <p className='text-gray-500 text-xs font-medium '>
                <span>Created</span> {formatDate(event?.createdAt)}
              </p>
              <p className='text-[#828485] text-xs font-medium text-left'>
                Organized by{" "}
                <span className='font-bold text-[#636566] cursor-pointer'>
                  <Link href={`/user/${event?.managedBy?.name}`}>
                    {event?.managedBy?.name}
                  </Link>
                </span>
              </p>
              <p className='text-[#828485] text-xs font-medium text-left'>
                Group{" "}
                <span className='font-bold text-[#636566] cursor-pointer'>
                  <Link href={`/groups/${event?.group?.name}`}>
                    {event?.group?.name}
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-4 w-full sm:w-auto'>
          <Button
            disabled={isPending}
            onClick={() => {
              setApproveEventd(event?._id);
              mutate();
            }}
            className='rounded-3xl border-[0.2px] bg-[#F0FCEA] border-[#69AF5447] hover:bg-[#F0FCEA] text-[#588640] w-full sm:w-auto'>
            Approve
          </Button>
          <Button
            disabled={rejectPending}
            onClick={() => {
              setDeleteOpen(true);
              setEventId(event?._id);
            }}
            className='rounded-3xl border-[0.2px] bg-[#FCEAEA] border-[#AF545447] hover:bg-[#FCEAEA] text-[#9B0305] w-full sm:w-auto'>
            Reject
          </Button>
        </div>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              event from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setEventId("");
              }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={rejectPending}
              onClick={() => {
                rejectMutate();
              }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
