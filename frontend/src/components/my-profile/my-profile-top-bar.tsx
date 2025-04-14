"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { TopicsSidebar } from "../community/topics-sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
export function MyProfileTopBar() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const CloseSideBar = () => {
    setSheetOpen(false);
  };

  const activeTabs = [
    {
      slug: "Posts",
      name: "Posts",
      subItems: [
        { slug: "commented-posts", name: "Commented Posts" },
        { slug: "created-posts", name: "Created Posts" },
        { slug: "favourite-posts", name: "Favourite Posts" },
      ],
    },
    {
      slug: "Events",
      name: "Events",
      subItems: [
        { slug: "organised-events", name: "Organised Events" },
        { slug: "participated-events", name: "Events Participated" },
      ],
    },
    {
      slug: "Groups",
      name: "Groups",
      subItems: [
        { slug: "created-groups", name: "Created Groups" },
        { slug: "joined-groups", name: "Joined Groups" },
      ],
    },
    {
      slug: "joined-communities",
      name: "Joined Communities",
      subItems: [],
    },
    {
      slug: "payment",
      name: "Experiences",
      subItems: [],
    },
    {
      slug: "settings",
      name: "Settings",
      subItems: [],
    },
  ];

  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

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

        <div
          ref={scrollContainerRef}
          className='flex overflow-x-auto mr-16 overflow-hidden hide-scrollbar cursor-grab active:cursor-grabbing relative'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}>
          <div className='flex space-x-4 px-6 py-2 hide-scrollbar'>
            {activeTabs.map((topic, index) => {
              const hasSubItems = topic.subItems && topic.subItems.length > 0;
              return hasSubItems ? (
                <Popover
                  key={index}
                  open={openPopoverIndex === index}
                  onOpenChange={(isOpen) =>
                    setOpenPopoverIndex(isOpen ? index : null)
                  }>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "text-nowrap px-5 py-3 text-lg flex items-center gap-2 bg-transparent font-normal text-fadedtext cursor-pointer data-[state=open]:text-contrasttext",
                        topic.slug === activeTab &&
                          "text-contrasttext font-bold"
                      )}>
                      <span className='font-medium'>{topic.name}</span>
                      <ChevronDown className='h-4 w-4 text-muted-foreground transition-transform duration-200' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-48'>
                    <div className='flex flex-col'>
                      {topic.subItems.map((sub, idx) => (
                        <div
                          key={idx}
                          className='px-4 py-2 text-sm hover:bg-muted cursor-pointer rounded'
                          onClick={() => {
                            setActiveTab(sub.slug as any);
                            setOpenPopoverIndex(null);
                          }}>
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    setActiveTab(topic.slug as any);
                  }}
                  className={cn(
                    "text-nowrap px-5 py-3 text-lg font-medium cursor-pointer",
                    topic.slug === activeTab
                      ? "text-contrasttext font-bold"
                      : "text-fadedtext"
                  )}>
                  {topic.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
