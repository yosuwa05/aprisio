"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { TopicsSidebar } from "./topics-sidebar";
type Topic = {
  _id: string;
  topicName: string;
};

export function TopCommunityBar() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const response = await _axios.get("/topics?limit=40");
      return response.data;
    },
  });

  const {
    data: subTopics,
    isLoading: isLoadingSubTopics,
    isFetching,
  } = useQuery({
    queryKey: ["user-subtopic", selectedTopic?._id],
    gcTime: 0,
    queryFn: async () => {
      const response = await _axios.get(
        `/topics/getsubtopics?topic=${selectedTopic?._id}`
      );
      return response.data;
    },
  });

  return (
    <div className="bg-[#F2F5F6] h-[50px] flex items-center overflow-hidden">
      <div className="flex gap-4 items-center ml-4 md:ml-12 w-full">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm md:text-lg text-contrasttext text-nowrap flex gap-2 items-center">
            Explore Community
          </h2>
          <Icon icon="octicon:chevron-right-12" />

          <Sheet>
            <SheetTrigger>
              <Icon icon="mage:filter" className="text-lg md:text-xl" />
            </SheetTrigger>
            <SheetContent className="p-0" side={"left"}>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <TopicsSidebar />
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
          className="w-full overflow-hidden"
        >
          <CarouselContent className="mr-16">
            {!isLoading &&
              data &&
              data.topics?.map((topic: Topic) => (
                <CarouselItem
                  key={topic._id}
                  className="basis-1/1 flex justify-center"
                >
                  <Menubar className="bg-transparent border-none">
                    <MenubarMenu>
                      <div className="text-sm md:text-lg font-bold text-fadedtext md:font-normal select-none ">
                        {topic.topicName}
                      </div>

                      <MenubarTrigger
                        className="text-lg text-fadedtext bg-transparent cursor-pointer font-normal w-fit data-[state=open]:text-contrasttext"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic);
                        }}
                      >
                        <Icon
                          icon="icon-park-outline:down"
                          className="text-xl my-auto h-full  mt-1 text-[#5D5A5A]"
                        />
                      </MenubarTrigger>

                      <MenubarContent>
                        {isLoadingSubTopics || isFetching ? (
                          [...Array(3)].map((_, index) => (
                            <Skeleton
                              key={index}
                              className="w-32 h-6 my-2 rounded-md"
                            />
                          ))
                        ) : !isFetching && subTopics?.subTopics?.length > 0 ? (
                          subTopics.subTopics.map(
                            (subTopic: any, subTopicIndex: number) => (
                              <MenubarItem key={subTopicIndex}>
                                {subTopic.subTopicName}
                              </MenubarItem>
                            )
                          )
                        ) : (
                          <MenubarItem>No SubTopics</MenubarItem>
                        )}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
