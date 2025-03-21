// "use client";
// import Image from "next/image";
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import {
//   Autoplay,
//   EffectCoverflow,
//   Navigation,
//   Pagination,
// } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import arrow2 from "../../../public/images/arrow-2.png";
// import food from "../../../public/images/food-1.jpg";
// import heart1 from "../../../public/images/green-heart.png";
// import hiking from "../../../public/images/hiking-2.jpg";
// import heart2 from "../../../public/images/yellow-heart.png";
// import yoga from "../../../public/images/yoga.png";
// import coffee from "../../../public/images/coffee.jpg";
// import mic from "../../../public/images/mic.jpeg";
// import Link from "next/link";
// import { parseISO, format, isValid } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import { _axios } from "@/lib/axios-instance";
// import { BASE_URL } from "@/lib/config";
// function formatDate(dateString: any) {
//   if (!dateString) {
//     return "Date not available";
//   }

//   let date;

//   if (typeof dateString === "string") {
//     date = parseISO(dateString);
//   } else {
//     date = new Date(dateString);
//   }

//   if (!isValid(date)) {
//     console.error("Invalid date format:", dateString);
//     return "Invalid Date";
//   }

//   return format(date, "MMM dd, yyyy");
// }

// export default function Events() {
//   const { data: bata } = useQuery({
//     queryKey: ["data"],
//     queryFn: async () => {
//       const res = await _axios.get("/events/noauth/admin-events?limit=3");
//       return res.data;
//     },
//   });

//   return (
//     <section className='bg-white relative'>
//       <div className='absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2'>
//         <Image src={heart1} alt='heart' className='lg:w-12  lg:h-12 h-6 w-6 ' />
//       </div>
//       <div className='absolute lg:top-[20%] top-[2.5%] md:left-[22%] left-[40%] lg:left-[36%] -z-2'>
//         <Image src={heart2} alt='heart' className='lg:w-12  lg:h-12 w-6 h-6 ' />
//       </div>
//       <div className='lg:px-14 relative z-20 px-5 lg:pt-14  pt-7 flex justify-between items-center'>
//         <h1 className='text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold'>
//           <span> Upcoming Experiences</span>
//         </h1>
//         <p className='flex flex-col text-right'>
//           <span className='text-[#043A53] xl:text-6xl lg:text-4xl text-2xl font-semibold font-roboto'>
//             2025
//           </span>
//         </p>
//       </div>

//       <div className='px-14 lg:py-20  lg:block hidden'>
//         <Swiper
//           modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
//           spaceBetween={50}
//           slidesPerView={3}
//           //   effect="coverflow"
//           coverflowEffect={{
//             rotate: 0,
//             stretch: 0,
//             // depth: 100,
//             // modifier: 2,
//             slideShadows: false,
//           }}
//           //   pagination={{ clickable: true }}
//           // loop={true}
//           loopAdditionalSlides={2}
//           autoplay={{ delay: 3000 }}
//           className='mySwiper'>
//           {bata?.events?.map((item: any, index: any) => (
//             <SwiperSlide key={index}>
//               <div className='relative rounded-2xl overflow-hidden'>
//                 <Image
//                   loading='eager'
//                   src={BASE_URL + `/file?key=${item.eventImage}`}
//                   height={100}
//                   width={100}
//                   alt={"image"}
//                   className='h-[450px] w-full object-cover rounded-2xl'
//                 />

//                 <div className='absolute px-4 py-4 flex justify-between bottom-0 text-center w-full z-10 bg-[#ffffffc4]'>
//                   <div>
//                     <p className='font-mulish flex items-center text-xl text-[#353535]'>
//                       {item?.eventName}
//                     </p>
//                     <p className='font-mulish flex items-center text-xl text-[#353535]'>
//                       {formatDate(item?.datetime)} - {item?.location}
//                     </p>
//                   </div>
//                   <div>
//                     <Link
//                       className='cursor-pointer'
//                       href={`/top-events/${item?._id}`}>
//                       <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <div className='block py-8 pb-16 lg:hidden'>
//         {bata?.events?.map((item: any, index: any) => (
//           <div key={index} className='flex pt-8 justify-center'>
//             <div className='relative w-[90%] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl overflow-hidden'>
//               <Image
//                 src={BASE_URL + `/file?key=${item.eventImage}`}
//                 height={100}
//                 width={100}
//                 alt={"image"}
//                 className='w-full h-auto aspect-[4/5] object-cover rounded-2xl'
//               />

//               <div className='absolute px-4 py-4 flex justify-between bottom-0 text-center w-full z-10 bg-[#FFFFFFA1]'>
//                 <div>
//                   <p className='font-mulish flex items-center text-left text-[1.25rem] text-[#353535]'>
//                     {item?.eventName}
//                   </p>
//                   <p className='font-mulish flex items-center text-left text-[1.25rem] text-[#353535]'>
//                     {formatDate(item?.datetime)} - {item?.location}
//                   </p>
//                 </div>
//                 <div>
//                   <Link
//                     className='cursor-pointer'
//                     href={`/top-events/${item?._id}`}>
//                     <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
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

// Date Formatting Function
function formatDate(dateString: any) {
  if (!dateString) return "Date not available";

  let date =
    typeof dateString === "string"
      ? parseISO(dateString)
      : new Date(dateString);
  if (!isValid(date)) {
    console.error("Invalid date format:", dateString);
    return "Invalid Date";
  }

  return format(date, "MMM dd, yyyy");
}

export default function Events() {
  const { data: bata } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await _axios.get("/events/noauth/admin-events?limit=3");
      return res.data;
    },
  });

  return (
    <section className='bg-white relative'>
      {/* Floating Decorative Elements */}
      <div className='absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2'>
        <Image src={heart1} alt='heart' className='lg:w-12 lg:h-12 h-6 w-6' />
      </div>
      <div className='absolute lg:top-[20%] top-[2.5%] md:left-[22%] left-[40%] lg:left-[36%] -z-2'>
        <Image src={heart2} alt='heart' className='lg:w-12 lg:h-12 w-6 h-6' />
      </div>

      {/* Header */}
      <div className='lg:px-14 relative z-20 px-5 lg:pt-14 pt-7 flex justify-between items-center'>
        <h1 className='text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold'>
          <span>Upcoming Experiences</span>
        </h1>
        <p className='flex flex-col text-right'>
          <span className='text-[#043A53] xl:text-6xl lg:text-4xl text-2xl font-semibold font-roboto'>
            2025
          </span>
        </p>
      </div>

      {/* Desktop View - Swiper Carousel */}
      <div className='px-14 lg:py-20 hidden lg:block'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={50}
          slidesPerView={3}
          coverflowEffect={{ rotate: 0, stretch: 0, slideShadows: false }}
          loopAdditionalSlides={2}
          autoplay={{ delay: 3000 }}
          className='mySwiper'>
          {bata?.events?.map((item: any, index: any) => (
            <SwiperSlide key={index}>
              <div className='relative rounded-2xl overflow-hidden shadow-lg'>
                <Image
                  loading='eager'
                  src={BASE_URL + `/file?key=${item.eventImage}`}
                  height={500}
                  width={400}
                  alt='Event Image'
                  className='w-full h-[450px] object-cover rounded-2xl'
                />
                <div className='absolute bottom-0 left-0 w-full bg-white bg-opacity-90 px-5 py-3 flex justify-between items-center rounded-b-2xl'>
                  <div className='text-left w-full max-w-[200px]'>
                    <p className='font-mulish text-lg font-semibold text-[#353535] truncate'>
                      {item?.eventName}
                    </p>
                    <p className='font-mulish text-sm text-[#555] truncate'>
                      {formatDate(item?.datetime)} - {item?.location}
                    </p>
                  </div>
                  <Link
                    className='cursor-pointer min-w-max'
                    href={`/top-events/${item?._id}`}>
                    <Image src={arrow2} alt='Arrow' className='w-12 h-12' />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile View - Stack Layout */}
      <div className='block py-8 pb-16 lg:hidden'>
        {bata?.events?.map((item: any, index: any) => (
          <div key={index} className='flex pt-8 justify-center'>
            <div className='relative w-[90%] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-lg'>
              <Image
                src={BASE_URL + `/file?key=${item.eventImage}`}
                height={500}
                width={400}
                alt='Event Image'
                className='w-full aspect-[4/5] object-cover rounded-2xl'
              />
              <div className='absolute bottom-0 left-0 w-full bg-white bg-opacity-90 px-5 py-3 flex justify-between items-center rounded-b-2xl'>
                <div className='text-left w-full max-w-[200px]'>
                  <p className='font-mulish text-lg font-semibold text-[#353535] truncate'>
                    {item?.eventName}
                  </p>
                  <p className='font-mulish text-sm text-[#555] truncate'>
                    {formatDate(item?.datetime)} - {item?.location}
                  </p>
                </div>
                <Link
                  className='cursor-pointer min-w-max'
                  href={`/top-events/${item?._id}`}>
                  <Image src={arrow2} alt='Arrow' className='w-12 h-12' />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
