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
import { Skeleton } from "../ui/skeleton";
import { TopicsSidebar } from "./topics-sidebar";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Sample topics data
  const topics = [
    {
      name: "Technology",
      submenu: [
        "Web Development",
        "Mobile Apps",
        "AI & Machine Learning",
        "Cybersecurity",
      ],
    },
    {
      name: "Business",
      submenu: ["Marketing", "Finance", "Entrepreneurship", "Management"],
    },
    {
      name: "Design",
      submenu: ["UI/UX", "Graphic Design", "3D Modeling", "Animation"],
    },
    {
      name: "Health",
      submenu: ["Fitness", "Nutrition", "Mental Health", "Medical Research"],
    },
    {
      name: "Education",
      submenu: [
        "Online Learning",
        "K-12",
        "Higher Education",
        "Professional Development",
      ],
    },
    {
      name: "Entertainment",
      submenu: ["Movies", "Music", "Gaming", "Streaming"],
    },
    {
      name: "Science",
      submenu: ["Physics", "Biology", "Chemistry", "Astronomy"],
    },
    {
      name: "Travel",
      submenu: [
        "Destinations",
        "Travel Tips",
        "Adventure",
        "Cultural Experiences",
      ],
    },
  ];

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up and leave to stop dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle topic click to toggle dropdown
  const handleTopicClick = (e: React.MouseEvent, index: number) => {
    // Only toggle dropdown if we're not dragging
    if (!isDragging) {
      e.stopPropagation(); // Prevent event from bubbling up
      setActiveDropdown(activeDropdown === index ? null : index);
    }
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    setActiveDropdown(null);
  };
  return (
    <div className='bg-[#F2F5F6] h-[60px] flex items-center overflow-hidden'>
      <div className='flex gap-4 items-center ml-4 md:ml-12 w-full'>
        <div className='flex items-center gap-2'>
          <h2
            className='font-bold text-sm md:text-lg text-contrasttext text-nowrap flex gap-2 items-center cursor-pointer'
            onClick={() => router.push("/feed")}>
            Explore Community
          </h2>
          <Icon icon='octicon:chevron-right-12' />

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
        <div
          ref={scrollContainerRef}
          className='flex overflow-x-auto mr-16 overflow-hidden hide-scrollbar  cursor-grab active:cursor-grabbing scrollbar-none relative'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}>
          <div className='flex space-x-4 px-6 py-2 hide-scrollbar'>
            {!isLoading &&
              data &&
              data.topics?.map((topic: Topic) => (
                <Popover key={topic._id}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTopic(topic);
                      }}
                      className={cn(
                        "  text-nowrap px-5 py-3 text-lg text-fadedtext flex gap-2 items-center bg-transparent cursor-pointer font-normal w-fit data-[state=open]:text-contrasttext   justify-between"
                      )}>
                      <span className='font-medium'>{topic.topicName}</span>
                      <ChevronDown className='h-4 w-4 text-muted-foreground transition-transform duration-200' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-48'>
                    {isLoadingSubTopics ||
                      (isFetching &&
                        [...Array(3)].map((_, index) => (
                          <Skeleton
                            key={index}
                            className='w-32 h-6 my-2 rounded-md'
                          />
                        )))}
                    {subTopics?.subTopics?.map(
                      (subTopic: any, subTopicIndex: number) => (
                        <div
                          key={subTopicIndex}
                          onClick={() =>
                            router.push(`/feed/explore/${subTopic?.slug}`)
                          }
                          className='block px-4 py-2 text-sm hover:bg-muted transition-colors'>
                          {subTopic?.subTopicName}
                        </div>
                      )
                    )}
                  </PopoverContent>
                </Popover>
              ))}
          </div>
        </div>
        {/* <Carousel
          opts={{
            align: "center",
            axis: "x",
            dragFree: true,
            direction: "ltr",
            containScroll: "keepSnaps",
          }}
          className='w-full overflow-hidden'>
          <CarouselContent className='mr-16'>
            {!isLoading &&
              data &&
              data.topics?.map((topic: Topic) => (
                <CarouselItem
                  key={topic._id}
                  className='basis-1/1 flex justify-center'>
                  <Menubar className='bg-transparent border-none'>
                    <MenubarMenu>
                      <MenubarTrigger
                        className='text-lg text-fadedtext flex gap-2 items-center bg-transparent cursor-pointer font-normal w-fit data-[state=open]:text-contrasttext'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic);
                        }}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          className='text-sm md:text-lg font-bold text-fadedtext md:font-normal select-none '>
                          {topic.topicName}
                        </div>
                        <Icon
                          icon='icon-park-outline:down'
                          className='text-xl my-auto h-full  mt-[5px] text-[#5D5A5A]'
                        />
                      </MenubarTrigger>

                      <MenubarContent>
                        {isLoadingSubTopics || isFetching ? (
                          [...Array(3)].map((_, index) => (
                            <Skeleton
                              key={index}
                              className='w-32 h-6 my-2 rounded-md'
                            />
                          ))
                        ) : !isFetching && subTopics?.subTopics?.length > 0 ? (
                          subTopics?.subTopics.map(
                            (subTopic: any, subTopicIndex: number) => (
                              <MenubarItem
                                className='cursor-pointer'
                                onClick={() =>
                                  router.push(`/feed/explore/${subTopic?.slug}`)
                                }
                                key={subTopicIndex}>
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
        </Carousel> */}
      </div>
    </div>
  );
}
