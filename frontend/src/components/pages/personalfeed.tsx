import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PersonalFeedPosts } from "./personal-feed-posts";

export default function PersonalFeed() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["user-Joined-things"],
    queryFn: async () => {
      return await _axios.get(`/personal/joined-things`);
    },
  });
  const [openSections, setOpenSections] = useState({
    joinedGroups: true,
    joinedEvents: true,
    topicsFollowed: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev: any) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div>
      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8 ">
        <div className="flex w-full max-w-[1200px] mx-auto gap-4">
          <div className="hidden lg:block lg:max-w-[300px] min-w-[300px] lg:h-[81vh] overflow-y-auto hide-scrollbar">
            <Collapsible
              open={openSections.joinedGroups}
              onOpenChange={() => toggleSection("joinedGroups")}
            >
              <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center">
                <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                  <div className="flex gap-3 items-center">
                    <Icon icon="gravity-ui:persons" />
                    <h1 className={`capitalize text-sm md:text-lg `}>
                      Joined Groups
                    </h1>
                  </div>
                  <Icon
                    className={`text-xl `}
                    icon={
                      openSections.joinedGroups
                        ? "octicon:chevron-up-12"
                        : "octicon:chevron-down-12"
                    }
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 px-4 ">
                {data?.data?.joinedGroups?.map((group: any) => (
                  <p
                    onClick={() => router.push(`/groups/${group?.groupSlug}`)}
                    key={group?._id}
                    className="text-textcol py-1.5 cursor-pointer  md:py-3"
                  >
                    {group?.groupName}
                  </p>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSections.joinedEvents}
              onOpenChange={() => toggleSection("joinedEvents")}
            >
              <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center">
                <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                  <div className="flex gap-3 items-center">
                    <Icon icon="uiw:date" />
                    <h1 className={`capitalize text-sm md:text-lg `}>
                      Joined Events
                    </h1>
                  </div>
                  <Icon
                    className={`text-xl `}
                    icon={
                      openSections.joinedEvents
                        ? "octicon:chevron-up-12"
                        : "octicon:chevron-down-12"
                    }
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 px-4 ">
                {data?.data?.joinedEvents?.map((event: any) => (
                  <p
                    onClick={() => router.push(`/events/${event?._id}`)}
                    key={event?._id}
                    className="text-textcol py-1.5 cursor-pointer  md:py-3"
                  >
                    {event?.eventName}
                  </p>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSections.topicsFollowed}
              onOpenChange={() => toggleSection("topicsFollowed")}
            >
              <CollapsibleTrigger className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center">
                <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                  <div className="flex gap-3 items-center">
                    <Icon icon="hugeicons:note" />
                    <h1 className={`capitalize text-sm md:text-lg `}>
                      Topics Followed
                    </h1>
                  </div>
                  <Icon
                    className={`text-xl `}
                    icon={
                      openSections.topicsFollowed
                        ? "octicon:chevron-up-12"
                        : "octicon:chevron-down-12"
                    }
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 px-4 ">
                {data?.data?.TopicsFollowed?.map((topic: any) => (
                  <p
                    onClick={() =>
                      router.push(`/feed/explore/${topic?.subtopicSlug}`)
                    }
                    key={topic?._id}
                    className="text-textcol py-1.5 cursor-pointer md:py-3"
                  >
                    {topic?.subtopicName}
                  </p>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[82vh] hide-scrollbar overflow-hidden">
            <PersonalFeedPosts />
          </div>

          {/* <div className="hidden lg:block lg:max-w-[350px] shadow-xl rounded-lg h-fit">
            <div className="bg-white px-4 rounded-xl w-[350px]">
              <div className="relative h-[110px] bg-white flex justify-center items-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/assets/placeholder-hero.jpeg)",
                    opacity: 0.3,
                  }}
                />

                <Button
                  onClick={() => {
                    console.log("Create Event");
                    router.push("/feed/create-event");
                  }}
                  className="relative z-10 bg-white text-[#D49D0D] shadow-[#d49c0d46] shadow-lg hover:bg-white"
                >
                  <Plus />
                  Create Event
                </Button>
              </div>

              <h1 className="text-2xl text-textcol my-4 font-semibold">
                Event
              </h1>

              <div className="flex flex-col  items-start gap-2 my-2">
                {data?.data?.joinedEvents?.length ? (
                  data?.data?.joinedEvents?.map((item: any) => (
                    <div
                      className="flex justify-between items-center w-full"
                      key={item?._id}
                    >
                      <div className="text-textcol flex flex-col gap-2">
                        <h4 className="text-[15px] font-medium">
                          {item?.eventName}
                        </h4>
                      </div>

                      <Button className="rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]">
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 w-full text-fadedtext text-sm">
                    No events joined
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
