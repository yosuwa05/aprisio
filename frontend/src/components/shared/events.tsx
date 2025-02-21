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
import food from "../../../public/images/food-1.jpg";
import heart1 from "../../../public/images/green-heart.png";
import hiking from "../../../public/images/hiking-2.jpg";
import heart2 from "../../../public/images/yellow-heart.png";
import yoga from "../../../public/images/yoga.png";
import coffee from "../../../public/images/coffee.jpg";
import mic from "../../../public/images/mic.jpeg";
export default function Events() {
  const data = [
    {
      title: "Immersive Coffee  Experience",
      src: coffee,
      date: "5 April 2025",
      loc: "Bangalore",
    },
    { title: "karaoke evening", src: mic, date: "May 2025" },
    { title: "Culinary Exploration", src: food, date: "June  2025" },
    // { title: "Yoga4", src: yoga, date: "24 Jan 2024" },
    // { title: "Yoga5", src: yoga, date: "25 Jan 2024" },
    // { title: "Yoga6", src: yoga, date: "26 Jan 2024" },
    // { title: "Yoga7", src: yoga, date: "27 Jan 2024" },
  ];

  return (
    <section className='bg-white relative'>
      {/* Header section */}
      <div className='absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2'>
        <Image src={heart1} alt='heart' className='lg:w-12  lg:h-12 h-6 w-6 ' />
      </div>
      <div className='absolute lg:top-[20%] top-[2.5%] md:left-[22%] left-[40%] lg:left-[36%] -z-2'>
        <Image src={heart2} alt='heart' className='lg:w-12  lg:h-12 w-6 h-6 ' />
      </div>
      <div className='lg:px-14 relative z-20 px-5 lg:pt-14  pt-7 flex justify-between items-center'>
        <h1 className='text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold'>
          <span> Upcoming Experiences</span>
          {/* <span>On this Year</span> */}
        </h1>
        <p className='flex flex-col text-right'>
          <span className='text-[#043A53] xl:text-6xl lg:text-4xl text-2xl font-semibold font-roboto'>
            2025
          </span>
        </p>
      </div>

      {/* Swiper Carousel Section */}
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
          loopAdditionalSlides={2} // Ensures the first two slides are appended for smooth scrolling
          autoplay={{ delay: 3000 }}
          className='mySwiper'>
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className='relative rounded-2xl overflow-hidden'>
                <Image
                  loading='eager'
                  src={item.src}
                  alt={item.title}
                  className='h-[450px] w-full object-cover rounded-2xl'
                />

                {/* Event Info */}
                <div className='absolute px-4 py-4 flex justify-between bottom-0 text-center w-full z-10 bg-[#ffffffc4]'>
                  <div>
                    <p className='font-mulish flex items-center text-xl text-[#353535]'>
                      {item.title}
                    </p>
                    <p className='font-mulish flex items-center text-xl text-[#353535]'>
                      {item.date} - {item?.loc}
                    </p>
                  </div>
                  <div>
                    <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <div className='block py-8  pb-16 lg:hidden'>
        {data.map((item, index) => (
          <div key={index} className='flex pt-8 justify-center'>
            <div className='relative h-96 w-[90%] max-w-[400px] rounded-2xl overflow-hidden'>
              <Image
                src={item.src}
                alt={item.title}
                unoptimized
                className='h-[450px] w-full object-left rounded-2xl'
              />

             
              <div className='absolute px-4 py-4 flex justify-between  bottom-0 text-center w-full z-10 bg-[#FFFFFFA1]'>
                <div>
                  <p className='font-mulish  flex items-center text-left text-[1.25rem] text-[#353535]'>
                    {item.title}
                  </p>
                  <p className='font-mulish  flex items-center text-left text-[1.25rem] text-[#353535]'>
                    {item.date} - {item?.loc}
                  </p>
                </div>
                <div>
                  <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <div className='block py-8 pb-16 lg:hidden'>
        {data.map((item, index) => (
          <div key={index} className='flex pt-8 justify-center'>
            <div className='relative w-[90%] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl overflow-hidden'>
              <Image
                src={item.src}
                alt={item.title}
                unoptimized
                className='w-full h-auto aspect-[4/5] object-cover rounded-2xl'
              />

              {/* Event Info */}
              <div className='absolute px-4 py-4 flex justify-between bottom-0 text-center w-full z-10 bg-[#FFFFFFA1]'>
                <div>
                  <p className='font-mulish flex items-center text-left text-[1.25rem] text-[#353535]'>
                    {item.title}
                  </p>
                  <p className='font-mulish flex items-center text-left text-[1.25rem] text-[#353535]'>
                    {item.date} - {item?.loc}
                  </p>
                </div>
                <div>
                  <Image src={arrow2} alt='Arrow' className='w-14 h-14' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
