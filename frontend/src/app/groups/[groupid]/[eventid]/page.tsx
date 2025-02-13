import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function ViewEventPage() {
  return (
    <main className=' px-3 md:px-8 md:py-6 py-3 '>
      <div className='flex items-center text-lg  cursor-pointer  gap-2'>
        <Icon className='font-semibold' icon={"weui:back-filled"} />
        <span className='text-textcol'>Back</span>
      </div>

      <div className='container mx-auto'>
        <div className='flex flex-col pt-4  md:pt-10 gap-y-5  md:gap-y-10 justify-center items-center'>
          <h1 className='text-textcol font-roboto text-xl  sm:text-2xl md:text-4xl  lg:text-6xl  xl:text-8xl font-semibold'>
            New Year Lunch Gathering
          </h1>
          <div className='flex items-center justify-center  gap-5 flex-wrap'>
            <div className='flex items-center gap-2 text-lg  md:text-2xl font-sans font-medium'>
              <Icon icon={"hugeicons:calendar-02"} />
              <p className='text-contrasttext'> March 17, 2024 - 10:00 AM</p>
            </div>
            <div className='flex items-center gap-2 text-lg  md:text-2xl font-sans font-medium'>
              <Icon icon={"hugeicons:location-06"} />
              <p className='text-contrasttext'> Nagercoil to Kallikesham</p>
            </div>
          </div>
          <div className=' text-base md:text-2xl'>
            Organised by{" "}
            <span className='text-textcol font-semibold '>
              Asian Outdoor Group
            </span>
          </div>
          <div>
            <Button className='rounded-full bg-buttoncol text-black shadow-none p-4  md:p-8   text-xs lg:text-xl hover:bg-buttoncol font-semibold'>
              Attend Event
            </Button>
          </div>
        </div>

        <section className='flex container md:max-w-6xl flex-wrap  gap-6  mx-auto  justify-center  md:justify-between px-2  md:px-5  md:gap-12 mt-8 md:mt-16 items-center'>
          <div className='flex flex-col  items-center gap-y-5'>
            <h1 className='text-contrasttext text-lg md:text-2xl  lg:text-5xl font-semibold'>
              200+
            </h1>
            <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
              No.of Members
            </p>
          </div>
          <div className='flex flex-col  items-center gap-y-5'>
            <h1 className='text-contrasttext text-lg md:text-2xl  lg:text-5xl font-semibold'>
              200+
            </h1>
            <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
              No.of Members
            </p>
          </div>
          <div className='flex flex-col  items-center gap-y-5'>
            <h1 className='text-contrasttext textx-lg md:text-2xl  lg:text-5xl font-semibold'>
              200+
            </h1>
            <p className='text-base md:text-2xl  lg:text-3xl font-normal text-textcol'>
              No.of Members
            </p>
          </div>
        </section>

        <article
          style={{ boxShadow: "0px 4px 60px 0px #02507C26" }}
          className='mt-8  md:mt-20 container max-w-6xl rounded-2xl  mx-auto p-6 '>
          <h3 className='text-xl font-bold'>Rule</h3>
          <p className='mt-3 text-lg  md:text-xl leading-relaxed   tracking-wide   whitespace-pre-line text-textcol/80'>
            <span className='text-contrasttext  font-sans font-semibold'>
              1. Health Check and Fitness Level -
            </span>{" "}
            All participants must consult their doctor before the event to
            ensure they are fit for the hike. Participants should also disclose
            any medical conditions to the event organizers.
          </p>
          <p className='mt-3 text-lg  md:text-xl  leading-loose whitespace-pre-line text-textcol/80'>
            <span className='text-contrasttext  font-sans font-semibold'>
              1. Health Check and Fitness Level -
            </span>{" "}
            All participants must consult their doctor before the event to
            ensure they are fit for the hike. Participants should also disclose
            any medical conditions to the event organizers.
          </p>
        </article>
      </div>
    </main>
  );
}
