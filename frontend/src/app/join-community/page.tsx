"use client";

import Image from "next/image";
import { RiArrowDownLine } from "react-icons/ri";
import join from "../../../public/images/retirement.png";
import JoinCommunityForm from "../../components/shared/joincommunity";
export default function JoinCommunity() {
  return (
    <section className="pt-28 bg-[#F2F5F6]">
      <div className="bg-[#F2F5F6] flex w-full ">
        <div className="flex flex-col justify-between lg:w-2/3 w-full lg:gap-0 gap-16 px-5 lg:px-0 lg:pl-32 lg:py-16 py-5">
          <div className="">
            <h1 className="font-semibold tracking-tight lg:text-5xl text-3xl !leading-normal lg:text-left  text-center font-mulish text-[#043A53]">
              Your Second Innings Begins Today. Take the First Step Toward a
              More Connected and Fulfilling Life.
            </h1>
          </div>
          <div className="">
            <div className="flex lg:top-36 lg:left-24  -top-64 items-center justify-center lg:justify-start">
              <span
                className="flex py-5 text-2xl pl-6 pr-4 text-[#353535] hover:scale-110 transition-all duration-300  font-mulish font-bold bg-[#F0B73F] rounded-full justify-center items-center gap-5 cursor-pointer"
                onClick={() => {
                  const scrollAmount = window.innerHeight * 0.75; // 60% of the viewport height
                  window.scrollBy({ top: scrollAmount, behavior: "smooth" });
                }}
              >
                Join Community
                <span className="text-white  bg-[#00000029] rounded-full p-1">
                  <RiArrowDownLine className="w-6 h-6" />
                </span>
              </span>
            </div>
          </div>

          <div>
            <p className="text-[#043A53] opacity-70 lg:text-left text-center  font-roboto font-medium text-xl">
              Lets join yourself to the community
            </p>
          </div>
        </div>
        <div className="lg:flex hidden  justify-end items-end right-0">
          <Image src={join} alt="image" className="h-[500px] w-full" />
        </div>
      </div>
      <div className="lg:py-16 lg:px-28 px-5 pt-5 bg-white">
        <div className="text-center flex w-full  flex-col gap-10 lg:pb-24 pb-10">
          <h1 className="lg:text-8xl text-3xl pt-5 font-bold text-center font-mulish">
            Join Community
          </h1>
          {/* <p className="font-mulish lg:text-2xl text-xl font-light">
      Lorem incididunt Mollit in laborum tempor Lorem incididunt irure. Aute eu ex ad sunt. Pariatur sint culpa do incididunt 
    </p> */}
        </div>
        <div>
          <JoinCommunityForm />
        </div>
      </div>
    </section>
  );
}
