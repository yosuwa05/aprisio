"use client";

import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { TopicsSidebar } from "../community/topics-sidebar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";

export function MyProfileTopBar() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const CloseSideBar = () => {
    setSheetOpen(false);
  };
  const activeTabs = [
    {
      slug: "commented-posts",
      name: "Commented Posts",
    },
    {
      slug: "created-posts",
      name: "Created Posts",
    },
    {
      slug: "favourite-posts",
      name: "Favourite Posts",
    },
    {
      slug: "organised-events",
      name: "Organised Events",
    },
    {
      slug: "events-participated",
      name: "Events Participated",
    },
    {
      slug: "created-groups",
      name: "Created Groups",
    },
    {
      slug: "joined-groups",
      name: "Joined Groups",
    },
    {
      slug: "settings",
      name: "Settings",
    },
  ];

  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  return (
    <div className='bg-[#F2F5F6] h-[50px] flex items-center overflow-hidden'>
      <div className='flex gap-2  md:gap-4 items-center ml-4 md:ml-6 w-full'>
        <div className='flex items-center gap-2'>
          <h2
            className='font-bold text-sm md:text-lg text-contrasttext text-nowrap flex gap-2 items-center cursor-pointer'
            onClick={() => router.push("/feed")}>
            Explore Community
          </h2>
          {/* <Icon icon='octicon:chevron-right-12' /> */}

          <Icon
            onClick={() => setSheetOpen(true)}
            icon='mage:filter'
            className='text-lg md:text-xl cursor-pointer'
          />

          <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
            <SheetTrigger></SheetTrigger>
            <SheetContent className='p-0' side={"left"}>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <TopicsSidebar CloseSideBar={CloseSideBar} />
            </SheetContent>
          </Sheet>
        </div>
        <Carousel
          opts={{
            align: "center",
            axis: "x",
            dragFree: true,
            direction: "ltr",
            containScroll: "keepSnaps",
          }}
          className='w-full overflow-hidden'>
          <CarouselContent className='mr-16'>
            {activeTabs?.map(
              (topic: { slug: string; name: string }, index: number) => (
                <CarouselItem
                  key={index}
                  className='basis-1/1 flex gap-5  justify-center'>
                  <div
                    key={index}
                    onClick={() => {
                      setActiveTab(topic.slug as any);
                    }}
                    className={`text-sm md:text-lg  md:pl-3  select-none cursor-pointer text-nowrap ${
                      topic.slug == activeTab
                        ? "text-contrasttext font-bold"
                        : "text-fadedtext"
                    }`}>
                    {topic.name}
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
