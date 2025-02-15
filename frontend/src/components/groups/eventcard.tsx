import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Props = {
  event: Event;
  gropuslug: string;
};

type Event = {
  _id: string;
  eventName: string;
  date: string;
  location: string;
  createdAt: string;
  attending: boolean;
};

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

type EventBody = {
  eventId: string;
};

export function EventCard({ event, gropuslug }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const { topic } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EventBody) => {
      return await _axios.post("/events/attendevent", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast(data.data.message || "Attended event successfully");
      } else {
        toast(data.data.error || "Something went wrong");
      }
    },
  });

  return (
    <div
      className="p-4 lg:px-8 my-5  rounded-lg transition-all mx-4"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex items-center gap-2 justify-between">
        <h6 className="text-contrasttext font-bold font-roboto">
          {formatDateString(new Date(event.date))}
        </h6>
        <p className="text-[#828485] text-sm">
          Created {formatDate(event.createdAt)}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-semibold font-sans">
            {event.eventName}
          </h1>
          <h3 className="mt-3 font-normal text-contrasttext text-lg">
            {event.location}
          </h3>
          <p className="mt-4 text-fadedtext text-sm font-medium">500 Members</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p
            onClick={() => router.push(`/groups/${gropuslug}/${event._id}`)}
            className="text-sm font-semibold text-contrasttext  cursor-pointer"
          >
            View Event
          </p>

          <Button
            disabled={isPending || event.attending}
            className={`
           bg-[#FCF7EA] hover:bg-[#FCF7EA] border-[#AF965447] rounded-3xl border-[0.2px]  text-black`}
            onClick={() => {
              if (isPending) return;
              if (!user) {
                toast("Login to continue");
                return;
              }
              mutate({
                eventId: event._id,
              });
            }}
          >
            {!event.attending ? "Attend Event" : "Joined"}
          </Button>
        </div>
      </div>
    </div>
  );
}
