import Postcard from "@/components/custom/postcard";
import Topbar from "@/components/custom/topbar/topbar";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Topbar />

      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:max-w-[300px]">
          <h1 className="font-[600] text-3xl text-textcol">Hiking</h1>
          <p className="font-medium text-[#353535CC] opacity-80 mt-2">
            Join a vibrant community of retired like-minded individuals
            exploring new interests, meaningful connections, and opportunities.
          </p>

          <div className="mt-4 flex flex-col gap-3 items-center">
            <img
              src="/assets/placeholder-hero.jpeg"
              className="rounded-xl"
              alt=""
            />
            <Button className="rounded-full bg-buttoncol text-black font-bold shadow-none p-6 hover:bg-buttoncol">
              Join Community
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col overflow-y-auto max-h-[91vh] hide-scrollbar">
          <Postcard />
          <Postcard />
          <Postcard />
        </div>

        <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
          <div className="bg-white px-4 rounded-xl w-[350px]">
            <div className="relative h-[110px] bg-white flex justify-center items-center overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url(/assets/placeholder-hero.jpeg)",
                  opacity: 0.3,
                }}
              />

              <Button className="relative z-10 bg-white text-[#D49D0D] shadow-[#d49c0d46] shadow-lg hover:bg-white">
                <Plus />
                Create Event
              </Button>
            </div>

            <h1 className="text-2xl text-textcol my-4 font-semibold">Event</h1>

            <div className="flex flex-col  items-start gap-2 my-2">
              {[1, 2, 3].map((item, index) => (
                <div
                  className="flex justify-between items-center w-full"
                  key={index}
                >
                  <div className="text-textcol flex flex-col gap-2">
                    <h4 className="text-[15px] font-medium">Hiking</h4>
                    <p className=" text-[#777777] text-xs flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Nagercoil to Kallikesham</span>
                    </p>
                  </div>

                  <Button className="rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]">
                    View
                  </Button>
                </div>
              ))}
            </div>

            <h1 className="text-2xl text-textcol my-4 font-semibold">Groups</h1>

            <div className="flex flex-col  items-start gap-2 my-2">
              {[1, 2].map((item, index) => (
                <div
                  className="flex justify-between items-center w-full"
                  key={`${index}-${item}`}
                >
                  <div className="text-textcol flex flex-col gap-2">
                    <h4 className="text-[15px] font-medium">Hiking</h4>
                    <p className=" text-[#777777] text-xs flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Nagercoil to Kallikesham</span>
                    </p>
                  </div>

                  <Button className="rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
