"use client";
import Image from "next/image";
import step1 from "../../../public/images/1.png";
import step2 from "../../../public/images/2.png";
import step3 from "../../../public/images/3.png";
import arrowDown from "../../../public/images/arrow-down.png";
import arrow from "../../../public/images/arrow.png";
export default function FAQ1() {
  return (
    <section className="lg:p-14 p-5 bg-white">
      <div>
        <h1 className=" font-mulish xl:text-7xl lg:text-5xl text-2xl text-[#353535] font-bold">
          How it Works?
        </h1>
        <p className="font-mulish font-light lg:pt-8 pt-2 text-[#353535CC] xl:text-3xl lg:text-2xl text-xl">
          Getting Started is Simple!
        </p>
      </div>

      <div className="lg:pt-16 pt-10 flex lg:flex-row flex-col gap-3 ">
        <div className="flex lg:flex-col items-start gap-5 lg:w-1/3 w-full ">
          <div className="">
            <Image
              className="xl:max-w-24 xl:max-h-24 lg:max-w-16 lg:max-h-16 max-w-14 max-h-14"
              src={step1}
              alt="step1"
            />
          </div>
          <div className=" lg:mt-0 ">
            <h1 className="text-[#353535] xl:pt-10 lg:pt-3 xl:text-4xl lg:text-2xl text-xl font-bold font-mulish">
              Create Your Profile
            </h1>
            <p className="font-mulish xl:text-3xl lg:text-xl text-xl text-[#353535CC] xl:pt-5 lg:pt-3 pt-1">
              Share your interests, passion and skills
            </p>
          </div>
        </div>
        <div className="pr-10 pt-6 lg:block hidden">
          <Image
            className="xl:max-h-16 xl:max-w-16 lg:h-12 lg:w-12"
            src={arrow}
            alt=""
          />
        </div>
        <div className="pl-4 pb-4 lg:hidden block">
          <Image className="h-6 w-6" src={arrowDown} alt="" />
        </div>

        <div className="flex lg:flex-col items-start gap-5 lg:w-1/3 w-full ">
          <div className="">
            <Image
              className="xl:max-w-24 xl:max-h-24 lg:max-w-16 lg:max-h-16 max-w-14 max-h-14"
              src={step2}
              alt="step1"
            />
          </div>
          <div className=" lg:mt-0">
            <h1 className="text-[#353535] xl:pt-10 lg:pt-3 xl:text-4xl lg:text-2xl text-xl font-bold font-mulish">
              Join Community
            </h1>
            <p className="font-mulish xl:text-3xl lg:text-xl text-xl text-[#353535CC] xl:pt-5 lg:pt-3 pt-1">
            Join like minded people who share your interests and passion.
            </p>
          </div>
          <div></div>
        </div>

        <div className="pr-10 pt-6 lg:block hidden">
          <Image
            className="xl:max-h-16 xl:max-w-16 lg:h-12 lg:w-12"
            src={arrow}
            alt=""
          />
        </div>
        <div className="pl-4 pb-4 lg:hidden block">
          <Image className="h-6 w-6" src={arrowDown} alt="" />
        </div>
        <div className="flex lg:flex-col items-start gap-5 lg:w-1/3 w-full">
          <div className="">
            <Image
              className="xl:max-w-24 xl:max-h-24 lg:max-w-16 lg:max-h-16 max-w-14 max-h-14"
              src={step3}
              alt="step3"
            />
          </div>
          <div className=" lg:mt-0">
            <h1 className="text-[#353535] xl:pt-10 lg:pt-3 xl:text-4xl lg:text-2xl text-xl font-bold font-mulish">
              Explore Experiences
            </h1>
            <p className="font-mulish xl:text-3xl lg:text-xl text-xl text-[#353535CC] xl:pt-5 lg:pt-3 pt-1">
            Join curated experiences designed around your interests and passion.
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
}
