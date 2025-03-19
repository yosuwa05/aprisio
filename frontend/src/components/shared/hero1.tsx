"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import avatar from "../../../public/images/pic (1).png";
import hero from "../../../public/images/hero.png";
import hearts from "../../../public/images/hearts.png";
import heroboy from "../../../public/images/hero-boy.png";
import herogirl from "../../../public/images/hero-girl.png";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";

function Hero1() {
  const user = useGlobalAuthStore((state) => state.user);
  return (
    <main className='relative mb-2  lg:mb-10 '>
      <section className=' flex flex-col   md:gap-14'>
        <div className='flex 2xl:mt-24 xl:mt-20 mt-14 flex-col justify-center 2xl:gap-20 xl:gap-8 lg:gap-8 md:gap-8 gap-5 items-center'>
          <h1 className='2xl:text-7xl xl:text-7xl w-[90%] z-10 leading-normal text-center lg:text-5xl md:text-5xl text-3xl font-semibold text-[#353535]'>
            Life, Curated. Together.
          </h1>
          {/* <h2 className='xl:text-6xl w-[90%] z-10 leading-normal text-center lg:text-4xl md:text-4xl text-2xl font-semibold text-[#353535]'>
            Your Best Days are Ahead of You
          </h2> */}
          <div className='w-full justify-center flex z-10'>
            <p className='text-center lg:w-1/2 w-[80%] flex text-[#353535CC] xl:text-2xl lg:text-xl md:text-lg text-base justify-center items-center'>
              Aprisio is a quiet invitation to connect. A community for
              individuals 40+, built around shared interests, meaningful
              experiences, and lasting friendships. No noise. No pressure. Just
              a place to enjoy what matters — with people who get it.
            </p>
          </div>
        </div>
        <div className='flex justify-center items-center mt-5 md:mt-0'>
          <Link href={user ? "/feed" : "/join-community"}>
            <button className='flex lg:py-3 xl:py-4 py-3 xl:text-2xl lg:text-xl text-xl xl:px-8 lg:px-6 px-5 font-mulish font-bold bg-[#C9A74E] rounded-full justify-center items-center gap-5'>
              {user ? "Explore Aprisio" : "Join Aprisio"}

              <span className='text-white bg-[#A48D4A] rounded-full mt-1 p-1'>
                <RiArrowRightLine className='w-6 h-6' />
              </span>
            </button>
          </Link>
        </div>
        <div
          className={` xl:ml-16 lg:ml-12 lg:mt-2 xl:mt-20 md:mt-0    flex lg:flex-row flex-col items-center`}>
          <Image
            src={avatar}
            alt=''
            loading='eager'
            className='xl:h-[5.7rem] xl:w-60 lg:w-44 lg:h-16 w-[8.6rem] h-6 invisible '
          />
        </div>
      </section>
      <div className='absolute lg:right-[2%] lg:top-[10%] top-[55%] right-3'>
        <Image
          src={hearts}
          loading='eager'
          alt='hearts'
          style={{
            width: "clamp(40px, 8vw, 72px)",
            height: "clamp(80px, 16vw, 128px)",
          }}
          className='object-contain'
        />
      </div>
      <div className='absolute lg:block hidden left-[4%] top-[20%]'>
        <Image
          src={heroboy}
          alt='hero2'
          loading='eager'
          style={{
            width: "clamp(40px, 8vw, 76px)",
            height: "clamp(80px, 16vw, 112px)",
          }}
          className='object-contain'
        />
      </div>
      <div className='absolute lg:block hidden left-[15%] top-[52%] '>
        <Image
          src={herogirl}
          alt='hero3'
          loading='eager'
          style={{
            width: "clamp(40px, 8vw, 86px)",
            height: "clamp(80px, 16vw, 128px)",
          }}
          className='object-contain'
        />
      </div>

      <div className='absolute z-1 hidden 3xl:hidden lg:block right-0 bottom-0'>
        <div className='flex justify-end'>
          <Image
            src={hero}
            loading='eager'
            priority
            alt='hero'
            className=' 2xl:w-full xl:w-[85%] lg:w-[70%] '
          />
        </div>
      </div>
    </main>
  );
}

export default Hero1;
