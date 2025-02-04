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
// import "@/app/hero.css";

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
    <section className="relative bg-red-50 md:bg-blue-200 lg:bg-yellow-500 xl:bg-green-500 scrollbar overflow-x-hidden lg:pt-24 pt-28 xl:pt-0 px-2   md:h-[100vh] h-[85vh] lg:px-0 mb-14 lg:mb-0">
    <div>
  <div className="absolute top-0">
    <div className={`flex flex-col ${isZoomedOut?'pt-20':'pt-10'}  md:h-screen  justify-start items-center `}>
        <div className="flex flex-col justify-center items-center w-[90%]">
          <h1
            className={`font-semibold  ${isZoomedOut?'xl:text-[66px]':'xl:text-[66px]'} lg:text-[45px] md:text-[32px] text-[24px]  text-[#353535] text-center font-roboto`}
          >
            Your career may be behind you.
          </h1>
          <h2
            className="font-semibold xl:text-[52px] lg:text-[40px] md:text-[24px] text-[18px] text-[#353535] text-center mt-5 lg:mt-5 font-roboto"
          >
            Your Best Days are ahead of you
          </h2>
          <div className="w-full flex justify-center items-center">
            <p
              // style={{
              //   fontSize: "clamp(18px, 2vw, 24px)",
              //   lineHeight: "2",
              // }} 
              className="text-center text-wrap xl:w-1/2 lg:w-[70%] w-[98%] text-[#353535CC] !leading-loose font-sans  xl:py-8 py-10 lg:py-5  xl:text-2xl lg:text-lg md:text-base text-sm"
            >
              Join a vibrant community of active, impactful, and like-minded
              post career individuals exploring new events & experiences,
              building new connections, and living their best lives.
            </p>
          </div>
        </div>
        <div
          className={`${
            isZoomedOut ? "" : ""
          } hover:scale-105 xl:py-6 lg:py-6 py-5  duration-300 transition-all`}
        >
          <Link href={"/join-community"}>
            <button
              // style={{
              //   fontSize: "clamp(16px, 2vw, 24px)",
              //   padding: "clamp(8px, 1.5vw, 16px) clamp(16px, 3vw, 32px)",
              // }}
              className="flex lg:py-3 xl:py-5 py-3 xl:text-2xl lg:text-xl text-xl xl:px-8 lg:px-6 px-5 font-mulish font-bold bg-[#C9A74E] rounded-full justify-center items-center gap-5"
              >
            
              Join Aprisio
              <span className="text-white bg-[#A48D4A] rounded-full mt-1 p-1">
                <RiArrowRightLine className="w-6 h-6" />
              </span>
            </button>
          </Link>
        </div>
        <div className="w-full">
      <div
        className={` xl:ml-16 lg:ml-12  md:mt-0 mt-10 ${
          isZoomedOut ? "lg:bottom-[0%]" : "lg:bottom-[0%]"
        } flex lg:flex-row flex-col items-center`}
      >
        <Image
          src={avatar}
          alt=""
          className="xl:h-[5.7rem] xl:w-60  lg:w-44 lg:h-16 w-[10.6rem] h-16"
        />
        <div className="flex mt-5 lg:mt-0 justify-center md:items-start lg:justify-start items-center">
          <p
            // style={{
            //   fontSize: "clamp(16px, 2vw, 24px)",
            // }}
            className="text-[#353535CC] lg:pl-3 xl:w-[100%] xl:text-3xl lg:text-2xl text-xl lg:w-[90%] lg:leading-relaxed lg:text-left text-center font-sans"
          >
            Thousands of post career people are joining Aprisio
          </p>
        </div>
      </div>
      </div>
    </div>
      
    
      {isZoomedOut && (
        <>
          <div className="absolute lg:right-[2%] lg:top-[10%] top-[55%] right-3">
            <Image
              src={hearts}
              alt="hearts"
              style={{
                width: "clamp(40px, 8vw, 72px)",
                height: "clamp(80px, 16vw, 128px)",
              }}
              className="object-contain"
            />
          </div>
          <div className="absolute lg:block hidden left-[6%] top-[16%]">
            <Image
              src={heroboy}
              alt="hero2"
              style={{
                width: "clamp(40px, 8vw, 76px)",
                height: "clamp(80px, 16vw, 112px)",
              }}
              className="object-contain"
            />
          </div>
          <div className="absolute lg:block hidden xl:left-[20%] xl:top-[40%] lg:top-[37%] lg:left-[20%]">
            <Image
              src={herogirl}
              alt="hero3"
              style={{
                width: "clamp(40px, 8vw, 86px)",
                height: "clamp(80px, 16vw, 128px)",
              }}
              className="object-contain"
            />
          </div>
        </>
      )}
    </div>


<div className="absolute z-1 hidden lg:block right-0 bottom-0 fixed-image">
  <div className="flex justify-end">
    <Image
      src={hero}
      priority
      alt="hero"
      className={`${
        isZoomedOut
          ? "lg:h-[80%] lg:w-[80%] xl:h-full xl:w-full "
          : "lg:h-[60%] lg:w-[60%] xl:h-[70%] xl:w-[70%]"
      }`}
    />
  </div>
</div>
    </div>
    
  

    </section>
  );
}
