"use client";

import { EventsSection } from "@/components/groups/events";
import { GroupsFeedSection } from "@/components/groups/feed/groups-feed-section";
import { PersonsSection } from "@/components/groups/persons";
import { PhotosSection } from "@/components/groups/photos";
import { GroupShareSection } from "@/components/groupshare-section";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react";
import placeholder from "@img/assets/placeholder-hero.jpeg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function GroupPage() {
  const { groupid } = useParams();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = ["Feed", "Shared Post", "About", "Events", "Members", "Photos"];

  const { data, isLoading } = useQuery({
    queryKey: ["group-info", groupid],
    queryFn: async () => {
      const res = await _axios.get(`/noauth/group/get/${groupid}`);
      return res.data;
    },
  });

  return (
    <div className='px-1 md:px-8 lg:px-16 xl:px-20 py-6'>
      <div className='flex flex-col lg:flex-row gap-8'>
        {isLoading ? (
          <Skeleton className='w-full lg:max-w-[300px] min-w-[250px]' />
        ) : (
          <div className='w-full lg:max-w-[300px] min-w-[250px] text-center lg:text-left'>
            <div className='flex lg:hidden gap-2 items-center text-lg'>
              <Icon
                icon='ic:round-chevron-left'
                className='cursor-pointer'
                fontSize={32}
                onClick={() => router.back()}
              />
              <h5 className=''>{data?.group?.name}</h5>
            </div>
            <div className='mt-4 flex flex-col gap-3 '>
              <Image src={placeholder} className='rounded-xl ' alt='' />
            </div>
            <h1 className='font-[600] text-2xl text-textcol capitalize mt-4'>
              {data?.group?.name}
            </h1>
            <div
              onClick={() => setActiveIndex(4)}
              className='flex gap-2 items-center cursor-pointer  mt-4'>
              <Icon
                icon='mingcute:user-1-line'
                fontSize={29}
                className='text-gray-600'
              />
              <p className='text-sm text-textcol'>
                {data?.group?.memberCount + 1} Member
                {data?.group?.memberCount + 1 > 1 && "s"}
              </p>
            </div>
          </div>
        )}

        <div className='flex-1 flex flex-col'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <div className='hidden lg:flex gap-2 items-center text-lg'>
              <Icon
                icon='ic:round-chevron-left'
                className='cursor-pointer'
                fontSize={32}
                onClick={() => router.back()}
              />
              <h5 className='hidden md:block'>{data?.group?.name}</h5>
            </div>
            <div className='flex overflow-x-auto whitespace-nowrap hide-scrollbar'>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer text-lg px-4 py-2 rounded-md transition-all duration-300 ${
                    index !== activeIndex
                      ? "text-fadedtext"
                      : "text-contrasttext font-bold "
                  }`}>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          <div className='mt-3'>
            {activeIndex === 0 && <GroupsFeedSection />}
            {activeIndex === 1 && <GroupShareSection />}
            {activeIndex === 2 && (
              <div className='px-4'>
                <h3 className='font-semibold text-2xl'>What We Are</h3>
                <p className='text-[#353535] leading-relaxed text-[16px] mt-5 font-normal'>
                  {data?.group.description}
                </p>
              </div>
            )}
            {activeIndex === 3 && (
              <EventsSection
                groupid={data?.group._id}
                gropuslug={data?.group?.slug}
              />
            )}
            {activeIndex === 4 && <PersonsSection groupid={data?.group._id} />}
            {activeIndex === 5 && <PhotosSection groupid={data?.group._id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
