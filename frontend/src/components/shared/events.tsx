"use client";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import arrow2 from "../../../public/images/arrow-2.png";
import heart1 from "../../../public/images/green-heart.png";
import heart2 from "../../../public/images/yellow-heart.png";
import Link from "next/link";
import { parseISO, format, isValid } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
const formatFullDate = (date: string) => {
  const newDate = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(newDate);
};
const formatEventDate = (date: string) => {
  const newDate = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(newDate);
};

export default function Events() {
  const { data: bata } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await _axios.get("/events/noauth/admin-events?limit=3");
      return res.data;
    },
  });
  const router = useRouter();
  return (
    <section className='bg-white relative'>
      <div className='absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2'>
        <Image src={heart1} alt='heart' className='lg:w-12  lg:h-12 h-6 w-6 ' />
      </div>
      <div className='absolute lg:top-[20%] top-[2.5%] md:left-[22%] left-[40%] lg:left-[36%] -z-2'>
        <Image src={heart2} alt='heart' className='lg:w-12  lg:h-12 w-6 h-6 ' />
      </div>
      <div className='lg:px-14 relative z-20 px-5 lg:pt-14  pt-7 flex justify-between items-center'>
        <h1 className='text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold'>
          <span> Upcoming Experiences</span>
        </h1>
        <p className='flex flex-col text-right'>
          <span className='text-[#043A53] xl:text-6xl lg:text-4xl text-2xl font-semibold font-roboto'>
            2025
          </span>
        </p>
      </div>

      <div className='px-14 lg:py-20  lg:block hidden'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={50}
          slidesPerView={3}
          //   effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            // depth: 100,
            // modifier: 2,
            slideShadows: false,
          }}
          //   pagination={{ clickable: true }}
          // loop={true}
          loopAdditionalSlides={2}
          autoplay={{ delay: 3000 }}
          className='mySwiper'>
          {bata?.events?.map((item: any, index: any) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => {
                  // if (item?.eventName == "Aprisio Coffee Masterclass") {
                  router.push(`/top-events/${item._id}`);
                  // }
                }}
                className='relative rounded-2xl overflow-hidden cursor-pointer'>
                <Image
                  loading='eager'
                  src={BASE_URL + `/file?key=${item.eventImage}`}
                  height={100}
                  width={100}
                  alt={"image"}
                  className='h-[450px] w-full object-cover rounded-2xl'
                />

                <div className='absolute px-4 py-4 flex justify-between bottom-0  w-full z-10 bg-[#ffffffc4]'>
                  <div className='w-full max-w-[80%]'>
                    <p className='font-mulish capitalize text-xl text-[#353535] truncate'>
                      {item?.eventName}
                    </p>
                    {/* <p className='font-mulish text-lg text-[#353535] truncate'>
                      {item?.eventName == "Aprisio Coffee Masterclass"
                        ? "Sun, Apr 6 2025  "
                        : formatEventDate(item?.datetime)}
                      &nbsp; - {item?.location}
                    </p> */}
                    <p className='font-mulish text-lg text-[#353535] truncate'>
                      {item?.isEventActivated === true
                        ? formatFullDate(item?.datetime)
                        : formatEventDate(item?.datetime)}{" "}
                      - {item.location}
                    </p>
                  </div>
                  <div>
                    <div className='cursor-pointer flex-shrink-0'>
                      <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='block py-8 pb-16 lg:hidden'>
        {bata?.events?.map((item: any, index: any) => (
          <div
            onClick={() => {
              // if (item?.eventName == "Aprisio Coffee Masterclass") {
              router.push(`/top-events/${item._id}`);
              // }
            }}
            key={index}
            className='flex pt-8 justify-center cursor-pointer'>
            <div className='relative w-[90%] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl overflow-hidden'>
              <Image
                src={BASE_URL + `/file?key=${item.eventImage}`}
                height={100}
                width={100}
                alt={"image"}
                className='w-full h-auto aspect-[4/5] object-cover rounded-2xl'
              />

              <div className='absolute px-4 py-4 flex justify-between bottom-0  w-full z-10 bg-[#FFFFFFA1]'>
                <div className='w-full max-w-[80%]'>
                  <p className='font-mulish capitalize text-xl text-[#353535] truncate'>
                    {item?.eventName}
                  </p>
                  {/* <p className='font-mulish text-lg text-[#353535] truncate'>
                    {item?.eventName == "Aprisio Coffee Masterclass"
                      ? "Sun, Apr 6 2025  "
                      : formatEventDate(item?.datetime)}{" "}
                    - {item?.location}
                  </p> */}
                  <p className='font-mulish text-lg text-[#353535] truncate'>
                    {item?.isEventActivated === true
                      ? formatFullDate(item?.datetime)
                      : formatEventDate(item?.datetime)}{" "}
                    - {item.location}
                  </p>
                </div>
                <div>
                  <div className='cursor-pointer flex-shrink-0'>
                    <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
