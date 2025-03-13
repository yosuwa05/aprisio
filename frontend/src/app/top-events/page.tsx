"use client";
import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import arrow2 from "../../../public/images/arrow-2.png";
import heart1 from "../../../public/images/green-heart.png";

const formatEventDate = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
};

export default function Events() {
  const limit = 10;
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["amdin-events"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/events/noauth/admin-events?page=${pageParam}&limit=${limit}`,
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.events?.length === limit ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const hasevents = !isLoading && data?.pages?.[0]?.events?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  return (
    <section className="bg-white relative">
      <div className="absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2">
        <Image src={heart1} alt="heart" className="lg:w-12  lg:h-12 h-6 w-6 " />
      </div>

      <div className="lg:px-14 relative z-20 px-5 pb-5  lg:pt-7  pt-4 flex justify-between items-center">
        <h1 className="text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold">
          <span>Popular Experiences</span>
        </h1>
      </div>

      <div className="px-4 md:px-8 lg:px-14 py-3 lg:py-5 h-[70vh] overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3  gap-10">
          {isLoading ? (
            Array.from({ length: limit }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-[250px]  rounded-lg" />
            ))
          ) : hasevents ? (
            data?.pages?.flatMap((page) =>
              page?.events?.map((event: any, index: number) => {
                return (
                  <div
                    onClick={() => router.push(`/top-events/${event._id}`)}
                    key={event?._id}
                    className="relative rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <Image
                      loading="eager"
                      src={BASE_URL + `/file?key=${event.eventImage}`}
                      alt={"image"}
                      width={500}
                      height={500}
                      className="w-full h-[250px] md:h-[400px] lg:h-[400px] object-cover rounded-2xl"
                    />

                    <div className="absolute bottom-0 w-full bg-white/80 px-4 py-4 flex justify-between items-center h-20">
                      <div className="w-full max-w-[80%]">
                        <p className="font-mulish capitalize text-xl text-[#353535] truncate">
                          {event.eventName}
                        </p>
                        <p className="font-mulish text-lg text-[#353535] truncate">
                          {formatEventDate(event?.datetime)} - {event.location}
                        </p>
                      </div>
                      <div className="cursor-pointer flex-shrink-0">
                        <Image src={arrow2} alt="Arrow" className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                );
              }),
            )
          ) : (
            <div className="flex flex-col justify-center items-center gap-4">
              <p className="text-gray-500 text-xs font-semibold">
                No Events found
              </p>
            </div>
          )}
          <div ref={ref} className="h-10"></div>
        </div>
        {isLoading || isFetchingNextPage ? (
          <div className="flex justify-center items-center my-4">
            <GlobalLoader />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </section>
  );
}
