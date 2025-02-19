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

  const tabs = ["Feed", "About", "Events", "Members", "Photos", "Shared Post"];

  const { data, isLoading } = useQuery({
    queryKey: ["group-info", groupid],
    queryFn: async () => {
      const res = await _axios.get(`/noauth/group/get/${groupid}`);
      return res.data;
    },
  });

  return (
    <div>
      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        {isLoading ? (
          <Skeleton className="lg:max-w-[300px] min-w-[250px]" />
        ) : (
          <div className="lg:max-w-[300px] min-w-[250px]">
            <div className="mt-4 flex flex-col gap-3 items-center">
              <Image src={placeholder} className="rounded-xl" alt="" />
            </div>
            <p className="font-medium text-[#353535CC] opacity-80 mt-2"></p>

            <h1 className="font-[600] text-2xl text-textcol capitalize">
              {data?.group.name}
            </h1>

            <div className="flex gap-2 items-center mt-4">
              <Icon
                icon="mingcute:user-1-line"
                fontSize={29}
                className="text-gray-600"
              />
              <p className="text-sm text-textcol">
                {data?.group?.memberCount} Member
                {data?.group?.memberCount > 1 && "s"}
                <br />
              </p>
            </div>
          </div>
        )}

        <div className="flex w-full lg:max-w-[1200px] mx-auto gap-4">
          <div className="flex-1 flex flex-col ">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center text-lg">
                <Icon
                  icon={"ic:round-chevron-left"}
                  className="cursor-pointer"
                  fontSize={32}
                  onClick={() => router.back()}
                />
                <h5 className="hidden md:block">{data?.group.name}</h5> -
                <h5 className="font-bold">About</h5>
              </div>

              <div className="flex">
                {tabs.map((tab, index: number) => (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                    className={`flex cursor-pointer text-lg mx-4 ${
                      index != activeIndex
                        ? "text-fadedtext"
                        : "text-contrasttext font-bold"
                    }`}
                  >
                    <h3>{tab}</h3>
                  </div>
                ))}
              </div>
            </div>

            {activeIndex == 0 && <GroupsFeedSection />}

            {activeIndex == 1 && (
              <div className="mx-6 my-4">
                <h3 className="font-semibold text-2xl">What We Are</h3>

                <p className="text-[#353535] leading-relaxed text-[16px] mt-5 font-normal">
                  {data?.group.description}
                </p>
              </div>
            )}

            {activeIndex == 2 && (
              <EventsSection
                groupid={data?.group._id}
                gropuslug={data?.group?.slug}
              />
            )}
            {activeIndex == 3 && <PersonsSection groupid={data?.group._id} />}
            {activeIndex == 4 && <PhotosSection groupid={data?.group._id} />}
            {activeIndex == 5 && <GroupShareSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
