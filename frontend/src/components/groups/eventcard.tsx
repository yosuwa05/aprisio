import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function EventCard() {
  const router = useRouter();
  return (
    <div
      className='p-4 lg:px-8  rounded-lg transition-all mx-4 '
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      <div className='flex items-center gap-2 justify-between'>
        <h6 className='text-contrasttext font-bold font-roboto'>
          SUN, JAN 5, 2025, 12:30 PM
        </h6>
        <p className='text-[#828485] text-sm'>Created by 3 months ago</p>
      </div>

      <div className='flex justify-between items-center mt-4'>
        <div>
          <h1 className='text-2xl font-semibold font-sans'>
            New Year Lunch Gathering
          </h1>
          <h3 className='mt-3 font-normal text-contrasttext text-lg'>
            Newyork US
          </h3>
          <p className='mt-4 text-fadedtext text-sm font-medium'>500 Members</p>
        </div>

        <div className='flex flex-col gap-2 items-center'>
          <p className='text-sm font-semibold text-contrasttext'>View Event</p>

          <Button
            className={`
           bg-[#FCF7EA] border-[#AF965447] rounded-3xl border-[0.2px]  text-black`}
            onClick={() => {}}>
            Attend Event
          </Button>
        </div>
      </div>
    </div>
  );
}
