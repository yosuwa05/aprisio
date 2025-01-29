"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import joinBg from "../../../public/images/blackbg.png";
import {
  default as joinSmall,
  default as joinTab,
} from "../../../public/images/JoinTab.png";
import retirement_md from "../../../public/images/retirement-md.png";
import retirement from "../../../public/images/retirement.png";

export default function Join() {
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
    <section className="relative w-full overflow-hidden">
      {/* Background images remain the same */}
      <div className="relative hidden lg:block">
        <Image
          src={joinBg}
          className="w-full h-[560px]"
          alt="Large Screen Image"
        />
      </div>

      {/* Circles - adjusted sizes */}
      <div className="absolute hidden -top-12 -right-12 lg:block">
        <div className={`rounded-full z-10 bg-[#F0B73FE3] ${
          isZoomedOut ? 'w-36 h-36' : 'w-40 h-40'
        }`}>
          <div></div>
        </div>
      </div>
      <div className="absolute hidden -top-12 -right-12 lg:block">
        <div className={`rounded-full z-10 bg-[#F0B73FB2] ${
          isZoomedOut ? 'w-32 h-32' : 'h-36 w-36'
        }`}>
          <div></div>
        </div>
      </div>
      <div className="absolute hidden -top-12 -right-12 lg:block">
        <div className={`rounded-full z-10 bg-[#F0B73F] ${
          isZoomedOut ? 'h-[100px] w-[100px]' : 'h-[120px] w-[120px]'
        }`}>
          <div></div>
        </div>
      </div>

      {/* Medium Screen */}
      <div className="relative hidden md:block lg:hidden">
        <Image
          src={joinTab}
          className="w-full h-[780px]"
          alt="Medium Screen Image"
        />
      </div>

      {/* Small Screen */}
      <div className="relative block md:hidden">
        <Image
          src={joinSmall}
          className="w-full h-[680px]"
          alt="Small Screen Image"
        />
      </div>

      {/* Retirement Images */}
      <div className="absolute bottom-0 h-full lg:flex items-end lg:right-0 hidden">
        <Image
          src={retirement}
          className={`w-full ${isZoomedOut ? 'h-[88%]' : 'h-[90%]'}`}
          alt="Screen Image"
        />
      </div>

      <div className="absolute h-[70%] w-full md:flex items-center justify-center bottom-0 hidden lg:hidden">
        <Image src={retirement_md} className="w-full" alt="md Screen Image" />
      </div>

      <div className="absolute h-[60%] w-full md:hidden items-center justify-center bottom-0 flex lg:hidden">
        <Image src={retirement_md} className="w-full" alt="md Screen Image" />
      </div>

      {/* Text Content - Fixed font sizes */}
      <div className="text-white absolute flex md:justify-start justify-center lg:top-16 top-10 xl:left-16 lg:left-9 lg:px-10 px-4">
        <h1 
          className="font-roboto lg:text-left text-center"
          style={{
            fontSize: isZoomedOut 
              ? 'clamp(24px, 2.5vw, 40px)'  // Smaller range for zoomed out
              : 'clamp(28px, 3vw, 48px)',   // Normal range
            lineHeight: '1.4',
            width: 'clamp(300px, 70%, 800px)',
            letterSpacing: '0.02em'
          }}
        >
          Your post career life begins today. Take the first step towards a, more connected fulfilling and impactful life.
        </h1>
      </div>

      {/* Button - Adjusted positioning and fixed sizes */}
      <div className="absolute inset-0 flex xl:top-52 lg:top-44 xl:left-24 lg:left-14 md:-top-[40%] -top-0 items-center justify-center lg:justify-start">
        <Link href={"/join-community"}>
          <span 
            className="flex font-mulish font-bold bg-[#F0B73F] hover:bg-[#f8cd71] hover:border-[#eba50d] hover:border-[5px] rounded-full justify-center items-center gap-5 transition-all duration-300"
            style={{
              fontSize: isZoomedOut ? 'lg:28px' : 'lg:20px', // Fixed font sizes
              padding: isZoomedOut
                ? '14px 20px'  // Smaller padding when zoomed out
                : '16px 24px', // Normal padding
              transform: `scale(${isZoomedOut ? 0.95 : 1})`
            }}
          >
            Join the Community
            <span className="text-white bg-[#00000029] rounded-full p-1">
              <RiArrowRightLine className={`${isZoomedOut ? 'w-5 h-5' : 'w-6 h-6'}`} />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}