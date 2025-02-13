import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { EventCard } from "./eventcard";

type Props = {
  groupid: string;
};

export function EventsSection({ groupid }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["group-events", user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/noauth/group/events/${groupid}?userId=${user?.id}`
      );
      return res.data;
    },
  });

  return (
    <div className="my-4">
      <div className="flex gap-2 items-center text-sm text-contrasttext cursor-pointer ml-2">
        <Icon icon="tabler:plus" fontSize={22} />
        <h3
          className="font-semibold text-sm"
          onClick={() => {
            router.push(`/community/groups/${groupid}/new-event`);
          }}
        >
          Create Event
        </h3>
      </div>

      <div className="mt-6 flex-col flex gap-4">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center my-4 gap-4">
            <Skeleton className="w-full h-[100px]  min-w-[250px]"> </Skeleton>
            <Skeleton className="w-full h-[100px]  min-w-[250px]"> </Skeleton>
            <Skeleton className="w-full h-[80px]  min-w-[250px]"> </Skeleton>
          </div>
        ) : (
          <div>
            {data?.events &&
              data?.events.map((event: any, index: number) => (
                <EventCard
                  key={index}
                  event={event}
                  attending={data?.attending}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
