"use client";
import EventCommentSection from "@/components/event/event-comment-section";
import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
type EventBody = {
  eventId: string;
};
export default function ViewEventPage() {
  const { eventid }: any = useParams();
  const router = useRouter();
  const user = useGlobalAuthStore((state) => state.user);

  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["view-single-Event", eventid, user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/events/noauth/view-event?eventId=${eventid}&userId=${user?.id}`
      );
      return res.data;
    },
  });

  function formatDateString(date: Date) {
    if (!date) {
      return "";
    }
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EventBody) => {
      return await _axios.post("/events/attendevent", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast(data.data.message || "Attended event successfully");
        refetch();
      }
    },
    onError(error: any) {
      toast.error(error.response.data.error || "Something went wrong");
    },
  });

  return (
    <main className=' px-3 md:px-8 md:py-6 py-3 '>
      <div
        onClick={() => router.back()}
        className='flex items-center text-lg  cursor-pointer  gap-2'>
        <Icon className='font-semibold' icon={"weui:back-filled"} />
        <span className='text-textcol'>Back</span>
      </div>

      {isLoading ? (
        <div className='flex h-[60vh] items-center justify-center'>
          <GlobalLoader />
        </div>
      ) : (
        <div className='container mx-auto'>
          <div className='flex flex-col pt-4  md:pt-10 gap-y-5  md:gap-y-10 justify-center items-center'>
            <h1 className='text-textcol font-roboto text-xl  sm:text-2xl md:text-4xl  lg:text-6xl  xl:text-8xl font-semibold'>
              {data?.event?.eventName}
            </h1>
            <div className='flex items-center justify-center  gap-5 flex-wrap'>
              <div className='flex items-center gap-2 text-lg  md:text-2xl font-sans font-medium'>
                <Icon icon={"hugeicons:calendar-02"} />
                <p className='text-contrasttext'>
                  {" "}
                  {formatDateString(new Date(data?.event?.date))}
                </p>
              </div>
              <div className='flex items-center gap-2 text-lg  md:text-2xl font-sans font-medium'>
                <Icon icon={"hugeicons:location-06"} />
                <p className='text-contrasttext'> {data?.event?.location}</p>
              </div>
            </div>
            <div className=' text-base md:text-2xl'>
              Organised by{" "}
              <span className='text-textcol font-semibold '>
                {data?.event?.isManagedByAdmin
                  ? "Aprisio"
                  : data?.event?.group?.name}
              </span>
            </div>
            {data?.event?.isApprovedByAdmin && (
              <div className='flex flex-col items-center'>
                <Button
                  onClick={() => {
                    if (isPending) return;
                    if (!user) return toast.error("Login to continue");
                    mutate({
                      eventId: eventid,
                    });
                  }}
                  disabled={data?.event?.attending}
                  className='rounded-full bg-buttoncol text-black shadow-none p-4  md:p-8   text-xs lg:text-xl hover:bg-buttoncol font-semibold'>
                  {!data?.event?.attending ? "Attend Event" : "Joined"}
                </Button>
                <div className='mt-4 text-gray-700 text-xs text-center'>
                  {data?.event?.attendees?.length} Members Attended
                </div>
              </div>
            )}
          </div>

          <article
            style={{ boxShadow: "0px 4px 60px 0px #02507C26" }}
            className='mt-8  md:mt-20 container max-w-6xl rounded-2xl  mx-auto p-6 '>
            <h3 className='text-xl font-bold'>Rule</h3>
            {data?.event?.rules?.map((rule: any, index: number) => (
              <p
                key={rule?._id}
                className='mt-3 text-lg  md:text-xl leading-relaxed   tracking-wide   whitespace-pre-line text-textcol/80'>
                <span className='text-contrasttext  font-sans font-semibold'>
                  {index + 1}. {rule?.heading} -
                </span>
                <span> </span>
                <span className='font-normal leading-loose'>
                  {" "}
                  {rule?.subHeading}
                </span>
              </p>
            ))}
          </article>
          {data?.event?.isApprovedByAdmin && (
            <div
              style={{ boxShadow: "0px 4px 60px 0px #02507C26" }}
              className='mt-14 rounded-2xl  pb-10 container max-w-6xl mx-auto p-8 '>
              {/* <div
    className='flex gap-2 lg:gap-1 items-center font-semibold px-2 rounded-full py-1 bg-gray-50 border-[1px] border-gray-200  cursor-pointer'
    onClick={() => setViewAllReplies(!viewAllReplies)}>
    <Icon
      className='h-4 w-4 lg:h-5 lg:w-5'
      icon='basil:comment-outline'
      color='black'
    />
    <p className='text-xs lg:text-sm'>
      {data?.event?.commentCount ?? 0}
    </p>
  </div> */}
              <p className='font-semibold mb-4 font-roboto text-2xl text-[#1F1F1F] '>
                Comments
              </p>

              <EventCommentSection
                eventId={eventid}
                // viewAllReplies={viewAllReplies}
                // setViewAllReplies={setViewAllReplies}
                // topic={topic}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
