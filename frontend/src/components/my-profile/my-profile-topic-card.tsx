"use client";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

interface ICommunity {
  _id: string;
  userId: string;
  subTopicId: {
    _id: string;
    subTopicName: string;
    slug: string;
    topic: {
      _id: string;
      topicName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface Props {
  communities: ICommunity;
}

export default function MyProfileTopicCard({ communities }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const { topic } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [subTopicID, setSubTopicId] = useState("");

  const { mutate: unJoinMutate, isPending: unjoinPending } = useMutation({
    mutationKey: ["unjoin-community"],
    mutationFn: async () => {
      const res = await _axios.post(`/delete-management/unjoin-community`, {
        subTopicId: subTopicID,
      });
      return res;
    },
    onSuccess: ({ data }) => {
      if (data.ok) {
        toast.success(data.message);
        setSubTopicId("");
        queryClient.invalidateQueries({ queryKey: ["joined"] });
        queryClient.invalidateQueries({
          queryKey: ["my-profile-joined-communities", user?.id, activeTab],
        });
      }
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <>
      <div className='p-4 w-full bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {communities?.subTopicId?.subTopicName}
            </h2>
            <p className='text-sm text-gray-500'>
              Topic: {communities?.subTopicId?.topic?.topicName}
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() =>
                router.push(`/feed/explore/${communities?.subTopicId?.slug}`)
              }
              className='rounded-full bg-[#F2F5F6] border border-[#043A53] text-black hover:bg-[#e6f0f2]'>
              View
            </Button>
            <Button
              disabled={unjoinPending}
              onClick={() => {
                setDeleteOpen(true);
                setSubTopicId(communities?.subTopicId?._id);
              }}
              className='rounded-full bg-[#FCEAEA] border border-[#AF545447] text-[#9B0305] hover:bg-[#fbd5d5]'>
              Leave
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will unjoin you from the
              community from our records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSubTopicId("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={unjoinPending}
              onClick={() => unJoinMutate()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
