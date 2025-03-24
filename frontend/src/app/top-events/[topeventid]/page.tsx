"use client";
import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import logosmall from "@img/images/final-logo.png";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";
import { isSameDay, parseISO } from "date-fns";
import chevronleft from "@img/icons/blue-chevron-left.svg";

const formatEventDate = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  // Convert to UTC to avoid time zone shifts
  const startDateUTC = new Date(startDate.toISOString().split("T")[0]);
  const endDateUTC = new Date(endDate.toISOString().split("T")[0]);

  if (isSameDay(startDateUTC, endDateUTC)) {
    return `${formatInTimeZone(
      startDate,
      "UTC",
      "EEE, MMM d yyyy, h:mm a"
    )} to ${formatInTimeZone(endDate, "UTC", "h:mm a")}`;
  } else {
    return (
      <>
        {formatInTimeZone(startDate, "UTC", "EEE, MMM d yyyy, h:mm a")} to
        <br />
        {formatInTimeZone(endDate, "UTC", "EEE, MMM d yyyy, h:mm a")}
      </>
    );
  }
};
export default function ViewTopEventPage() {
  const { topeventid } = useParams();
  const user = useGlobalAuthStore((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: ["view-Admin-Event", topeventid],
    queryFn: async () => {
      const res = await _axios.get(
        `/events/noauth/viewadmin-event?eventId=${topeventid}`
      );
      return res.data;
    },
  });

  const router = useRouter();

  if (data && !data?.event?.isEventActivated) {
    return (
      <main className='px-4 md:px-8 py-4 md:py-6 container mx-auto'>
        <div className='flex h-[60vh] flex-col gap-5 items-center justify-center'>
          <h1 className='text-3xl md:text-6xl text-center font-medium text-textcol font-roboto'>
            {data?.event?.eventName}
          </h1>
          <h1 className='text-xl md:text-2xl text-center font-medium text-textcol font-roboto'>
            Comming Soon...
          </h1>
          <Button
            onClick={() => {
              router.push("/top-events");
            }}
            className='rounded-full py-8 px-7  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
            Back to Experiences
            <Image src={chevronleft} alt='chevron-left' />
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className='px-4 md:px-8 py-4 md:py-6 container mx-auto'>
      {isLoading ? (
        <div className='flex h-[60vh] items-center justify-center'>
          <GlobalLoader />
        </div>
      ) : (
        <>
          <div className=''>
            <div className='flex flex-col '>
              <div className='flex flex-col gap-5'>
                <h1 className='text-3xl md:text-5xl font-medium text-textcol font-roboto'>
                  {data?.event?.eventName || "Event Name"}
                </h1>
                {/* <h2 className='text-xl md:text-2xl text-[#64737A]  font-roboto font-medium'>
                  {data?.event?.eventName == "Aprisio Coffee Masterclass"
                    ? "Sun, Apr 6 2025 ,4:00 pm to 6:30 pm"
                    : formatEventDate(data?.event?.datetime)}
                </h2> */}
              </div>
              <div className='flex justify-between flex-wrap items-center max-w-4xl gap-3 md:gap-0'>
                <h2 className='text-xl md:text-2xl text-[#64737A]  font-roboto font-medium'>
                  {formatEventDate(
                    data?.event?.datetime,
                    data?.event?.enddatetime
                  ) || ""}
                </h2>
                <div className=''>
                  <Button
                    onClick={() => {
                      if (!user) return toast.error("Login to continue");
                      if (data?.event?.reminingTickets === 0) {
                        return toast.error("No tickets available");
                      }
                      router.push("/buytickets/" + topeventid);
                    }}
                    className='bg-buttoncol hover:bg-buttoncol border border-gray-300 rounded-3xl   md:text-lg  text-black font-bold py-4  md:py-6 px-6'>
                    Buy Tickets
                  </Button>

                  <div className='text-[#353535CC]/80 font-extrabold font-roboto text-center text-lg py-2 '>
                    INR {data?.event?.price || ""} + GST
                  </div>
                </div>
              </div>
              <div className='text-contrasttext text-base font-sans flex justify-between flex-wrap items-center max-w-4xl'>
                <div>
                  {" "}
                  <h1 className='capitalize text-base  md:text-xl'>
                    {data?.event?.location || ""}
                  </h1>
                  <div className='capitalize text-base  md:text-xl'>
                    Hosted by : {data?.event?.organiserName || ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-10 pt-6'>
            <div className='w-full lg:w-1/4 flex-shrink-0'>
              <Image
                loading='eager'
                // src={coffee}
                height={100}
                width={100}
                src={BASE_URL + `/file?key=${data?.event?.eventImage}`}
                alt='Event Image'
                className='w-full h-auto object-cover'
              />

              <div
                style={{ boxShadow: "15px 4px 60px 0px #02507C26" }}
                className='mt-4 w-fullrounded-lg bg-[#FFFFFF] p-6 rounded-lg'>
                <div className='flex gap-4 items-center'>
                  <Image
                    src={logosmall}
                    className='w-[50px] cursor-pointer   '
                    alt='logo'
                  />
                  <div className='flex flex-col gap-1'>
                    <span className='text-textcol font-bold text-lg '>
                      About
                    </span>
                    <span className='text-fadedtext text-sm'>Aprisio</span>
                  </div>
                </div>
                <p className='font-normal text-lg pt-3 leading-8 break-words text-[#353535CC]/80  font-sans text-pretty whitespace-normal '>
                  {data?.event?.biography}
                </p>
              </div>
            </div>

            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.event?.description,
                }}
                className='lg:w-2/3 '></div>

              <Link href={data?.event?.mapLink} target='_blank'>
                <h1 className='text-lg text-blue-800 font-medium font-roboto'>
                  Get Directions
                </h1>
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
