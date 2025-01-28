"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import avatar from "../../../public/images/pic (1).png";
import hearts from "../../../public/images/hearts.png";
import heroboy from "../../../public/images/hero-boy.png";
import herogirl from "../../../public/images/hero-girl.png";
import hero from "../../../public/images/hero.png";

export default function Hero() {
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  useEffect(() => {
    const checkZoom = () => {
      const zoom = Math.round((window.innerWidth / window.outerWidth) * 100);
      setIsZoomedOut(zoom >= 100);
    };

    checkZoom();
    window.addEventListener("resize", checkZoom);

    return () => {
      window.removeEventListener("resize", checkZoom);
    };
  }, []);

  return (
    <section className="relative overflow-x-hidden lg:mt-36 mt-28  px-2 lg:h-[100%] lg:px-0 mb-14 lg:mb-0">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center w-[90%]">
          <h1 className="font-semibold text-[#353535] text-center xl:text-[75px] lg:text-[60px] text-[24px] font-roboto">
            Your career may be behind you.
          </h1>
          <h2 className="font-semibold text-[#353535] text-center xl:text-[60px] lg:text-[40px] text-[24px] mt-5 lg:mt-0 font-roboto">
            Your Best Days are ahead of you
          </h2>
          <div className="w-full flex justify-center items-center">
            <p className="text-center xl:w-1/2 lg:w-[80%] w-[98%] text-[#353535CC] leading-loose font-sans xl:text-[24px] lg:text-[20px] text-[18px] pt-10">
              Join a vibrant community of active, impactful, and like-minded
              post career individuals exploring new events & experiences,
              building new connections, and living their best lives.
            </p>
          </div>
        </div>
        <div
          className={`${
            isZoomedOut ? "pt-[7%]" : "pt-[2%]"
          } hover:scale-105 duration-300 transition-all`}
        >
          <Link href={"/join-community"}>
            <button className="flex lg:py-6 py-3 lg:text-2xl text-xl lg:px-9 px-5 font-mulish font-bold bg-[#C9A74E] rounded-full justify-center items-center gap-5">
              Join Aprisio
              <span className="text-white bg-[#A48D4A]  rounded-full mt-1 p-1">
                <RiArrowRightLine className="w-6 h-6" />
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div
        className={`  relative lg:left-16 lg:pb-20 mt-16 lg:mt-12 ${
          isZoomedOut ? "lg:bottom-[0%]" : "lg:bottom-[0%]"
        }  flex lg:flex-row flex-col items-center`}
      >
        <Image
          src={avatar}
          alt=""
          className="xl:h-[5.5rem] xl:w-60  lg:w-60 lg:h-20 w-40 h-16"
        />
        <div className="flex mt-5 lg:mt-0 justify-center md:items-start lg:justify-start items-center">
          {/* <h1 className="font-bold text-[#B9932E] font-lato xl:text-6xl lg:text-4xl text-3xl px-4">
            1K
          </h1> */}
          <p className="text-[#353535CC] lg:pl-5 xl:w-[90%] lg:w-[80%]  lg:leading-normal xl:text-[1.875rem] lg:text-left text-center lg:text-[1.5rem] text-[1.25rem] font-sans">
          Thousands of post career people are joining Aprisio
          </p>
        </div>
      </div>
      {isZoomedOut && (
        <>
          <div className="absolute lg:right-[2%] lg:top-[10%] top-[55%] right-3">
            <Image
              src={hearts}
              alt="hearts"
              className="lg:h-32 h-28 lg:w-[72px] w-[58px]"
            />
          </div>
          <div className="absolute lg:block hidden left-[6%] top-[16%]">
            <Image src={heroboy} alt="hero2" className="h-28 w-[76px]" />
          </div>
          <div className="absolute lg:block hidden xl:left-[20%] xl:top-[40%] lg:top-[37%] lg:left-[20%]">
            <Image src={herogirl} alt="hero3" className="h-32 w-[86px]" />
          </div>
        </>
      )}

      <div className="absolute -z-10 hidden lg:block right-0 bottom-0">
        <div className="flex justify-end">
          <Image
            src={hero}
            priority
            alt="hero"
            className={`${
              isZoomedOut
                ? "lg:h-[80%] lg:w-[80%] xl:h-full xl:w-full"
                : "lg:h-[80%] lg:w-[80%] xl:h-[80%] xl:w-[80%]"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
