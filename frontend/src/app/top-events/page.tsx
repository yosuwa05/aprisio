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
import { Button } from "@/components/ui/button";
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
    { title: "Culinary Exploration", src: food, date: "June  2025" },
    { title: "Culinary Exploration", src: food, date: "June  2025" },
    { title: "Culinary Exploration", src: food, date: "June  2025" },

    // { title: "Yoga4", src: yoga, date: "24 Jan 2024" },
    // { title: "Yoga5", src: yoga, date: "25 Jan 2024" },
    // { title: "Yoga6", src: yoga, date: "26 Jan 2024" },
    // { title: "Yoga7", src: yoga, date: "27 Jan 2024" },
  ];

  return (
    <section className='bg-white relative'>
      <div className='absolute top-[0.9%] left-[1.3%] lg:top-[6%] lg:left-[2.5%] -z-2'>
        <Image src={heart1} alt='heart' className='lg:w-12  lg:h-12 h-6 w-6 ' />
      </div>

      <div className='lg:px-14 relative z-20 px-5 lg:pt-14  pt-7 flex justify-between items-center'>
        <h1 className='text-[#353535] flex lg:gap-6 gap-1 flex-col xl:text-7xl lg:text-4xl text-2xl font-roboto font-semibold'>
          <span>Popular Events</span>
        </h1>
      </div>

      <div className='px-4 md:px-8 lg:px-14 py-10 lg:py-20 h-[70vh] overflow-y-auto hide-scrollbar'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'>
          {data.map((item, index) => (
            <div key={index} className='relative rounded-2xl overflow-hidden'>
              <Image
                loading='eager'
                src={item.src}
                alt={item.title}
                className='w-full h-[350px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl'
              />

              <div className='absolute bottom-0 w-full bg-white/80 px-4 py-4 flex justify-between items-center'>
                <div>
                  <p className='font-mulish text-xl text-[#353535]'>
                    {item.title}
                  </p>
                  <p className='font-mulish text-lg text-[#353535]'>
                    {item.date} - {item.loc}
                  </p>
                </div>
                <div>
                  <Image src={arrow2} alt='Arrow' className='w-12 h-12' />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-center mt-5'>
          <Button className='text-white rounded-2xl bg-buttoncol hover:bg-buttoncol px-6 py-2'>
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}
