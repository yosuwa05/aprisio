import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function ViewEventPage() {
  return (
    <main className='px-8 py-4'>
      <div className='flex items-center text-base  gap-2'>
        <Icon icon={"weui:back-filled"} />
        <span className='text-textcol'>Back</span>
      </div>

      <div>
        <h1>New Year Lunch Gathering</h1>
        <div>
          <div>
            <Icon icon={"hugeicons:calendar-02"} />
            March 17, 2024 - 10:00 AM
          </div>
          <div>
            <Icon icon={"hugeicons:location-06"} />
            Nagercoil to Kallikesham
          </div>
        </div>
        <div>Organised by Asian Outdoor Group</div>
        <div>
          <Button
            className='rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
            // onClick={() =>
            //   router.push(
            //     activeLayout == "group"
            //       ? "/community/create-group"
            //       : "/community/create-post"
            //   )
            // }
          >
            Attend Event
          </Button>
        </div>
      </div>
    </main>
  );
}
