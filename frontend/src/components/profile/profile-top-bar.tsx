"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Icon } from "@iconify/react";
import { useState } from "react";
type Topic = {
  _id: string;
  topicName: string;
};

export function ProfileTopBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-[#F2F5F6] h-[50px] flex items-center overflow-hidden">
      <div className="flex gap-4 items-center ml-4 md:ml-12 w-full">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm md:text-lg text-contrasttext text-nowrap flex gap-2 items-center">
            Explore Community
          </h2>
          <Icon icon="octicon:chevron-right-12" />

          <Icon
            icon="mage:filter"
            className="text-lg md:text-xl cursor-pointer"
          />
        </div>
        <Carousel
          opts={{
            align: "center",
            axis: "x",
            dragFree: true,
            direction: "ltr",
            containScroll: "keepSnaps",
          }}
          className="w-full overflow-hidden"
        >
          <CarouselContent className="mr-16">
            {["Created Posts", "Groups Participated", "Events Created"].map(
              (topic: string, index: number) => (
                <CarouselItem
                  key={index}
                  className="basis-1/1 flex justify-center"
                >
                  <div className="bg-transparent border-none cursor-pointer">
                    <div>
                      <div
                        onClick={() => setActiveIndex(index)}
                        className={`text-sm md:text-lg font-bold select-none ${
                          index == activeIndex
                            ? "text-contrasttext font-bold"
                            : "text-fadedtext"
                        }`}
                      >
                        {topic}
                      </div>
                    </div>
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
