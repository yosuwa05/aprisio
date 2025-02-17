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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { TopicsSidebar } from "./topics-sidebar";
type Topic = {
  _id: string;
  topicName: string;
};

export function TopCommunityBar() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const CloseSideBar = () => {
    setSheetOpen(false);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const response = await _axios.get("/topics?limit=400");
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
          <h2
            className="font-bold text-sm md:text-lg text-contrasttext text-nowrap flex gap-2 items-center cursor-pointer"
            onClick={() => router.push("/feed")}
          >
            Explore Community
          </h2>
          <Icon icon="octicon:chevron-right-12" />

          <Icon
            onClick={() => setSheetOpen(true)}
            icon="mage:filter"
            className="text-lg md:text-xl cursor-pointer"
          />

          <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
            <SheetTrigger></SheetTrigger>
            <SheetContent className="p-0" side={"left"}>
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
                      <MenubarTrigger
                        className="text-lg text-fadedtext flex gap-2 items-center bg-transparent cursor-pointer font-normal w-fit data-[state=open]:text-contrasttext"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic);
                        }}
                      >
                        <div className="text-sm md:text-lg font-bold text-fadedtext md:font-normal select-none ">
                          {topic.topicName}
                        </div>
                        <Icon
                          icon="icon-park-outline:down"
                          className="text-xl my-auto h-full  mt-[5px] text-[#5D5A5A]"
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
                          subTopics?.subTopics.map(
                            (subTopic: any, subTopicIndex: number) => (
                              <MenubarItem
                                className="cursor-pointer"
                                onClick={() =>
                                  router.push(`/feed/explore/${subTopic?.slug}`)
                                }
                                key={subTopicIndex}
                              >
                                {subTopic?.subTopicName}
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
