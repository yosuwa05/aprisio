import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FeedPosts } from "./personal-feed-posts";

export default function PersonalFeed() {
  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();

  return (
    <div>
      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:max-w-[300px] min-w-[300px]">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm font-bold text-contrasttext text-lg w-full text-start flex gap-2 items-center">
              <Icon icon="gravity-ui:persons" /> Joined Groups
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-6 pl-4 ">
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm font-bold text-contrasttext text-lg w-full text-start flex gap-2 items-center">
              <Icon icon="uiw:date" /> Joined Events
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-6 pl-4 ">
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm font-bold text-contrasttext text-lg w-full text-start flex gap-2 items-center">
              <Icon icon="hugeicons:note" /> Topics Followed
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-6 pl-4">
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
              <p>NYC Tri-state Asian Outdoors, Food, Travel & Random Events</p>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="flex w-full max-w-[1200px] mx-auto gap-4">
          <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[91vh] hide-scrollbar overflow-hidden">
            <FeedPosts />
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

              <h1 className="text-2xl text-textcol my-4 font-semibold">
                Event
              </h1>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
