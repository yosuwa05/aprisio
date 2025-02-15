"use client";
import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ViewEventPage() {
  const { eventid } = useParams();

  const { data, isLoading } = useQuery<any>({
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

  return (
    <main className=' px-3 md:px-8 md:py-6 py-3 '>
      <div className='flex items-center text-lg  cursor-pointer  gap-2'>
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
              <Button className='rounded-full bg-buttoncol text-black shadow-none p-4  md:p-8   text-xs lg:text-xl hover:bg-buttoncol font-semibold'>
                Attend Event
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
        </div>
      )}
    </main>
  );
}
