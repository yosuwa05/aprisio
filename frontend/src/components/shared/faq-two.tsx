"use client";
import Image from "next/image";
import job from "../../../public/images/Briefcase.png";
import circle from "../../../public/images/Ellipse.png";
import heart2 from "../../../public/images/heart-2.png";
import monitor from "../../../public/images/monitor.png";
// import group from "../../../public/images/People.png";
import rect from "../../../public/images/Rectangle.png";
import share from "../../../public/images/sharing.png";
import arrowSVG from "../../../public/images/Vector (1).svg";
// import vector from "../../public/images/Vector.png"
export default function FAQ2() {
  return (
    <section className="bg-[#F2F5F6] lg:px-14 px-5 lg:pb-0 pb-12">
      <div className="absolute  right-0">
        <Image src={heart2} className="h-12 w-12" alt="hearts" />
      </div>
      <div className="font-roboto lg:py-20 py-6 font-semibold xl:text-7xl lg:text-5xl text-2xl text-[#353535]">
        <h1>Why Aprisio?</h1>
      </div>
      {/* cards */}

      <div className="grid lg:grid-cols-3  xl:gap-20 lg:gap-16 gap-10 relative">
        <div className="flex lg:flex-col lg:gap-10 gap-5 items-start">
          <div className="xl:h-28 rounded-full xl:w-28 lg:h-20 lg:w-20 bg-[#FFE4E0]  h-14 w-14 flex items-center justify-center">
            <Image src={share} className="xl:p-10 lg:p-5 p-4" alt="sharing" />
          </div>
          <div className="flex flex-col gap-4 lg:pt-0 pt-3 lg:w-full w-3/4">
            <h1 className="font-roboto font-semibold xl:text-4xl lg:text-2xl text-2xl text-[#353535]">
            Interest based groups
            </h1>
            <p className="font-sans xl:text-3xl lg:text-xl text-xl text-[#353535CC]">
            Connect with like-minded individuals.
            </p>
          </div>
        </div>
        <div className="lg:hidden block absolute top-[15%] md:top-[13%] md:left-[2%] left-[4%]">
          <Image src={arrowSVG} alt="arrow" className="h-12  w-5" />
        </div>
        <div className="flex lg:flex-col lg:gap-10 gap-5 items-start">
          <div className="xl:h-28 rounded-full xl:w-28 lg:h-20 lg:w-20 bg-[#FFE7CE] h-14 w-14 flex items-center justify-center">
            <Image src={monitor} className="xl:p-10 lg:p-5 p-4" alt="sharing" />
          </div>
          <div className="flex flex-col gap-4 lg:pt-0 pt-3 lg:w-full w-3/4">
            <h1 className="font-roboto font-semibold xl:text-4xl lg:text-2xl text-2xl text-[#353535]">
            Virtual and In-person Events
            </h1>
            <p className="font-sans xl:text-3xl lg:text-xl text-xl text-[#353535CC]">
            Network virtually and in-person with like-minded individuals.
            </p>
          </div>
        </div>
        {/* 
                <div className="">
                        <Image src={vector} className="" alt="sharing" />
                    </div> */}

        <div className="lg:hidden block absolute top-[50%] md:top-[40%] md:left-[2%] left-[4%]">
          <Image src={arrowSVG} alt="arrow" className="h-12 w-5" />
        </div>
        {/* <div className="flex lg:flex-col lg:gap-10 gap-5 items-start">
          <div className="xl:h-28 rounded-full xl:w-28 lg:h-20 lg:w-20 bg-[#EBDEBB] h-14 w-14 flex items-center justify-center">
            <Image src={group} className="xl:p-10 lg:p-5 p-4" alt="sharing" />
          </div>
          <div className="flex flex-col gap-4 lg:pt-0 pt-3 lg:w-full w-3/4">
            <h1 className="font-roboto font-semibold xl:text-4xl lg:text-2xl text-2xl text-[#353535]">
              Supportive Community
            </h1>
            <p className="font-sans xl:text-3xl lg:text-xl text-xl text-[#353535CC]">
              Join a safe and friendly space to grow.
            </p>
          </div>
        </div> */}

        {/* <div className="lg:hidden block absolute top-[64%] md:top-[66%] md:left-[2%] left-[4%]">
          <Image src={arrowSVG} alt="arrow" className="h-12 w-5" />
        </div> */}

        <div className="flex lg:flex-col lg:gap-10 gap-5 items-start">
          <div className="xl:h-28  hidden rounded-full xl:w-28 lg:h-20 lg:w-20 bg-[#EBDEBB] h-14 w-14 lg:flex items-center justify-center">
            <Image src={job} className="xl:p-10 lg:p-5 p-4" alt="sharing" />
          </div>
          <div className="lg:hidden block ">
            <div className="xl:h-28 rounded-full xl:w-28 lg:h-20 lg:w-20 bg-[#D3E6BF] h-14 w-14  items-center justify-center">
              <Image src={job} className="lg:p-10 p-4" alt="sharing" />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:pt-0 pt-3 lg:w-full w-3/4">
            <h1 className="font-roboto  font-semibold xl:text-4xl lg:text-2xl text-2xl text-[#353535]">
            Discover & Access curated Experiences
            </h1>

            <p className="font-sans xl:text-3xl lg:text-xl text-xl text-[#353535CC]">
             Join exclusive, tailor made experiences designed for you.
            </p>
          </div>
        </div>
      </div>

      {/* clip */}
      <div className="relative lg:block hidden w-full top-5 ">
        <div className="w-full relative">
          <Image src={rect} alt="rect" className="w-full h-auto" priority />
        </div>
        <div className="absolute top-[33%] left-[29%] transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src={circle}
            alt="circle"
            className="w-16 h-16 lg:h-10 lg:w-10  md:w-12 md:h-12"
            priority
          />
        </div>
        <div className="absolute  top-[7%]  left-[44%] w-[50%]">
          <h1 className="text-[#353535] xl:text-6xl lg:text-4xl font-bold font-roboto">
            Our Milestone
          </h1>
          <p className="text-[#353535CC] pt-7 xl:text-2xl text-xl">
            Aprisio celebrates milestones of growth, connection, and
            exploration, empowering post-career individuals to embrace new
            opportunities, build meaningful relationships, and live with renewed
            passion and purpose.
          </p>
        </div>
        <div className="flex absolute w-full top-[70%] justify-around">
          <div className="text-center">
            <h1 className=" text-[#043A53] font-roboto font-semibold xl:text-6xl text-4xl">
              10+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans xl:text-4xl lg:text-2xl">
              Years Experience
            </p>
          </div>
          <div className="text-center">
            <h1 className=" text-[#043A53] font-roboto font-semibold xl:text-6xl text-4xl">
              200+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans xl:text-4xl lg:text-2xl">
              Users Empowered
            </p>
          </div>
          <div className="text-center">
            <h1 className=" text-[#043A53] font-roboto font-semibold xl:text-6xl text-4xl">
              100+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans xl:text-4xl lg:text-2xl">
              Job Provided
            </p>
          </div>
        </div>
      </div>

      <div className="block lg:hidden w-full bg-white  mt-12  rounded-2xl">
        <div className="px-4 py-6">
          <h1 className="text-[#353535]  text-xl font-bold font-roboto">
            Our Milestone
          </h1>
          <p className="text-[#353535CC] lg:pt-7 pt-3 font-mulish lg:text-2xl text-base">
            Aprisio celebrates milestones of growth, connection, and
            exploration, empowering post-career individuals to embrace new
            opportunities, build meaningful relationships, and live with renewed
            passion and purpose.
          </p>
        </div>
        <div className="flex w-full flex-wrap justify-evenly  items-center">
          <div className="text-center md:w-auto w-1/2">
            <h1 className=" text-[#043A53] font-roboto font-semibold text-3xl">
              10+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans text-lg">
              Years Experience
            </p>
          </div>
          <div className="text-center md:w-auto w-1/2">
            <h1 className=" text-[#043A53] font-roboto font-semibold text-3xl">
              200+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans text-lg">
              Users Empowered
            </p>
          </div>
          <div className="text-center md:mt-0 my-10">
            <h1 className=" text-[#043A53] font-roboto font-semibold text-3xl">
              100+
            </h1>
            <p className="text-[#353535CC] pt-3 font-sans text-lg">
              Job Provided
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
