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
    <div className={`lg:h-[100vh] relative  scrollbar overflow-x-hidden  px-[0.5rem] lg:px-0 mb-[3.5rem] lg:mb-0 ${isZoomedOut ? 'lg:mt-[12rem]' : 'lg:pt-[10rem]'}`}>
      <section className="relative">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[90%]">
            <h1 
              className="font-semibold text-[#353535] text-center font-roboto"
              style={{
                fontSize: 'clamp(24px, 5vw, 67.2px)',
                lineHeight: '1.2'
              }}
            >
              Your career may be behind you.
            </h1>
            <h2 
              className="font-semibold text-[#353535] text-center mt-5 lg:mt-0 font-roboto"
              style={{
                fontSize: 'clamp(24px, 4vw, 60px)',
                lineHeight: '1.2'
              }}
            >
              Your Best Days are ahead of you
            </h2>
            <div className="w-full flex justify-center items-center">
              <p 
                className="text-center xl:w-1/2 lg:w-[80%] w-[98%] text-[#353535CC] leading-loose font-sans pt-10"
                style={{
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  lineHeight: '1.6'
                }}
              >
                Join a vibrant community of active, impactful, and like-minded
                post career individuals exploring new events & experiences,
                building new connections, and living their best lives.
              </p>
            </div>
          </div>
          <div className={`${isZoomedOut ? "md:pt-[5%] pt-[10%]" : "md:pt-[2%] pt-[10%]"} hover:scale-105 duration-300 transition-all`}>
            <Link href={"/join-community"}>
              <button 
                className="flex font-mulish font-bold bg-[#C9A74E] rounded-full justify-center items-center gap-5"
                style={{
                  fontSize: 'clamp(16px, 5vw, 24px)',
                  padding: isZoomedOut 
                  ? 'clamp(8px, 1.5vw, 20px) clamp(20px, 3vw, 40px)' 
                  : 'clamp(12px, 2vw, 24px) clamp(16px, 3vw, 30px)'
                }}
              >
                Join Aprisio
                <span className="text-white bg-[#A48D4A] rounded-full mt-1 p-1">
                  <RiArrowRightLine className="w-6 h-6" />
                </span>
              </button>
            </Link>
          </div>
        </div>
        <div className={`relative lg:left-16 lg:pb-20 mt-16 lg:pt-2 ${
          isZoomedOut ? "lg:bottom-[0%]" : "lg:bottom-[0%]"
        } flex lg:flex-row flex-col items-center`}>
          <Image
            src={avatar}
            alt=""
            className="xl:h-[5.7rem] xl:w-60 lg:w-60 lg:h-[5.5rem] w-[10.6rem] h-16"
          />
          <div className="flex mt-5 lg:mt-0 justify-center md:items-start lg:justify-start items-center">
            <p 
              className="text-[#353535CC] lg:pl-5 xl:w-[90%] lg:w-[80%] lg:leading-normal font-sans lg:text-left text-center"
              style={{
                fontSize: 'clamp(20px, 3vw, 30px)',
                lineHeight: '1.4'
              }}
            >
              Thousands of post career people are joining Aprisio
            </p>
          </div>
        </div>
        {isZoomedOut && (
          <>
            <div className="absolute right-3 md:top-[55%] md:bottom-auto lg:bottom-[80%] lg:top-auto lg:right-[2%]">
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
                  ? "lg:h-[90%] lg:w-[90%] xl:h-full xl:w-full "
                  : "lg:h-[60%] lg:w-[60%] xl:h-[70%] xl:w-[70%]"
              }`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}