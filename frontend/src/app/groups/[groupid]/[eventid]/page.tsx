"use client";
import EventCommentSection from "@/components/event/event-comment-section";
import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
type EventBody = {
  eventId: string;
};
export default function ViewEventPage() {
  const { eventid }: any = useParams();
  const router = useRouter();
  const user = useGlobalAuthStore((state) => state.user);

  const [viewAllReplies, setViewAllReplies] = useState(false);
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["view -single-Event", eventid],
    queryFn: async () => {
      const res = await _axios.get(`/events/view-event?eventId=${eventid}`);
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
      } else {
        toast(data.data.error || "Something went wrong");
      }
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
                  {/* {data?.event?.date} */}
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
                {data?.event?.group?.name}
              </span>
            </div>
            <div>
              <Button
                onClick={() => {
                  if (isPending) return;
                  if (!user) {
                    toast("Login to continue");
                    return;
                  }
                  mutate({
                    eventId: eventid,
                  });
                }}
                disabled={data?.event?.attending}
                className='rounded-full bg-buttoncol text-black shadow-none p-4  md:p-8   text-xs lg:text-xl hover:bg-buttoncol font-semibold'>
                {!data?.event?.attending ? "Attend Event" : "Joined"}
              </Button>
            </div>
          </div>

          <section className='flex container md:max-w-6xl flex-wrap  gap-6  mx-auto  justify-center  md:justify-between px-2  md:px-5  md:gap-12 mt-8 md:mt-16 items-center'>
            <div className='flex flex-col  items-center gap-y-5'>
              <h1 className='text-contrasttext text-lg md:text-2xl  lg:text-5xl font-semibold'>
                {data?.event?.attendees?.length}+
              </h1>
              <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
                No.of Members
              </p>
            </div>
            <div className='flex flex-col  items-center gap-y-5'>
              <h1 className='text-contrasttext text-lg md:text-2xl  lg:text-5xl font-semibold'>
                200+
              </h1>
              <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
                No.of Intersted
              </p>
            </div>
            <div className='flex flex-col  items-center gap-y-5'>
              <h1 className='text-contrasttext textx-lg md:text-2xl  lg:text-5xl font-semibold'>
                200+
              </h1>
              <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
                No.of Views
              </p>
            </div>
          </section>

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
                {rule?.subHeading}
              </p>
            ))}
          </article>

          {/* <div className='mt-20 px-5 pb-10'>
            <div
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
            </div>
            <EventCommentSection
              eventId={eventid}
              viewAllReplies={viewAllReplies}
              setViewAllReplies={setViewAllReplies}
              // topic={topic}
            />
          </div> */}
        </div>
      )}
    </main>
  );
}
