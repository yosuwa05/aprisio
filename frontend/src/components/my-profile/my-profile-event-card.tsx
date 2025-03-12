import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { _axios } from "@/lib/axios-instance";
import { toast } from "sonner";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";

function formatDateString(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

type Props = {
  event: Event;
};

type Event = {
  _id: string;
  eventName: string;
  date: string;
  location: string;
  createdAt: string;
  attending: boolean;
  managedBy: string;
};

export function EventCard({ event }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const user = useGlobalAuthStore((state) => state.user);
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await _axios.post(`/events/decline-event?eventId=${event._id}`);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast(data.data.message || "Event declined successfully");
        queryClient.invalidateQueries({
          queryKey: ["my-profile-participated-events", user?.id, activeTab],
        });
        setOpen(false);
      } else {
        toast(data.data.message || "An error occurred");
      }
    },
  });

  return (
    <>
      <div
        className='p-4 lg:px-8 my-1  rounded-lg transition-all mx-4'
        style={{
          boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
        }}>
        <div className='flex items-center gap-2 justify-between'>
          <h6 className='text-contrasttext font-bold font-roboto'>
            {formatDateString(new Date(event.date))}
          </h6>
          <p className='text-[#828485] text-sm'>
            Created {formatDate(event.createdAt)}
          </p>
        </div>

        <div className='flex justify-between items-center mt-4'>
          <div>
            <h1 className='text-2xl font-semibold font-sans'>
              {event.eventName}
            </h1>
            <h3 className='mt-3 font-normal text-contrasttext text-lg'>
              {event.location}
            </h3>
            {/* <p className='mt-4 text-fadedtext text-sm font-medium'>
              500 Members
            </p> */}
          </div>

          <div className='flex flex-col gap-4 items-center'>
            <p
              onClick={() => {
                setOpen(true);
              }}
              className='text-sm font-semibold text-contrasttext  cursor-pointer'>
              Decline Event
            </p>

            <Button
              onClick={() => router.push(`/events/${event._id}`)}
              className={`
             bg-[#FCF7EA] hover:bg-[#FCF7EA] border-[#AF965447] rounded-3xl border-[0.2px]  text-black`}>
              View Event
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='font-roboto'>
          <DialogHeader>
            <DialogTitle className='text-contrasttext text-3xl'>
              Decline Event
            </DialogTitle>
            <div className='flex flex-col  '>
              <h1 className='font-sans font-medium text-xl text-textcol'>
                {event.eventName}
              </h1>
              <h3 className='text-lg pt-1 font-sans font-normal text-contrasttext'>
                {event.location}
              </h3>
            </div>
            <DialogDescription className='pt-2'>
              Are you sure you want to decline this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className='py-1 flex justify-end gap-x-4'>
            <Button
              onClick={() => setOpen(false)}
              className='bg-transparent hover:bg-transparent  text-contrasttext'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                mutate();
              }}
              disabled={isPending}
              className='rounded-3xl text-white bg-buttoncol hover:bg-buttoncol'>
              Decline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
