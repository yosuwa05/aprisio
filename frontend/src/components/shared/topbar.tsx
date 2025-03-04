"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Icon } from "@iconify/react";
import logosmall from "@img/images/final-logo.png";
import logo from "@img/images/logo.png";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { SearchBar } from "./searchbar";
import { UserAvatar } from "./useravatar";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if(pathname!='/'){
    const storedSection = sessionStorage.getItem("activeSection");
    setActiveSection(storedSection || pathname);
    }
  }, [pathname]);

  useEffect(() => {
    sessionStorage.setItem("activeSection", activeSection||'home');
  }, [activeSection]);

  
  const user = useGlobalAuthStore((state) => state.user);

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 1300);
  };

  const unwantedRoutes = ["/join-community"];

  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);

  const { data } = useQuery({
    queryKey: ["joined"],
    retry: false,
    staleTime: Infinity,
    enabled: user != null,
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
    <nav className="w-full flex px-4 my-4 justify-between md:px-6 ">
      <div className="flex  items-center">
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <div className="flex">
                <Menu size={24} />
              </div>
            </SheetTrigger>
            <SheetContent
              className="h-screen overflow-scroll p-0 px-2 flex flex-col justify-between  bg-white z-50"
              side={"left"}
            >
              <div>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>

                <Link
                  href={"/feed"}
                  className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center mt-12"
                >
                  <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                    <div className="flex gap-3 items-center">
                      <Icon
                        icon="material-symbols:explore-outline-rounded"
                        fontSize={20}
                      />

                      <h1 className={`capitalize text-sm md:text-lg `}>
                        Explore Community
                      </h1>
                    </div>
                  </div>
                </Link>

                {user && (
                  <>
                    <Collapsible
                      className="my-3"
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
                            onClick={() =>
                              router.push(`/groups/${group?.groupSlug}`)
                            }
                            key={group?._id}
                            className="text-textcol py-1.5 cursor-pointer  md:py-3"
                          >
                            {group?.groupName}
                          </p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      className="my-3"
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
                            onClick={() =>
                              router.push(
                                `/groups/${event?.groupSulg}/${event?._id}`
                              )
                            }
                            key={event?._id}
                            className="text-textcol py-1.5 cursor-pointer  md:py-3"
                          >
                            {event?.eventName}
                          </p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      className="my-3"
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
                              router.push(
                                `/feed/explore/${topic?.subtopicSlug}`
                              )
                            }
                            key={topic?._id}
                            className="text-textcol py-1.5 cursor-pointer md:py-3"
                          >
                            {topic?.subtopicName}
                          </p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}

                <div className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center mt-4">
                  <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                    <div className="flex gap-3 items-center">
                      <Icon icon="ix:about" />

                      <h1 className={`capitalize text-sm md:text-lg `}>
                        About
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-2 rounded-sm  w-full text-start flex gap-2 items-center mt-4">
                  <div className="w-full flex justify-between items-center  font-bold text-contrasttext ">
                    <div className="flex gap-3 items-center">
                      <Icon icon="material-symbols:call-outline-sharp" />

                      <h1 className={`capitalize text-sm md:text-lg `}>
                        Contact
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="flex flex-col my-2 gap-3">
                  <button
                    className="bg-white rounded-full font-semibold py-3 px-6 shadow border-[0.5px]"
                    onClick={() => router.push("/login")}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => router.push("/join-community")}
                    className="bg-[#C9A74E] rounded-full py-3 px-6 font-semibold "
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <Image
          src={logo}
          className="w-[120px] xl:w-[180px] cursor-pointer hidden md:block"
          alt="logo"
          priority={true}
          onClick={() => router.push("/")}
        />

        <Image
          src={logosmall}
          className="w-[25px] cursor-pointer md:hidden ml-3"
          alt="logo"
          onClick={() => router.push("/")}
        />

        <ul className="hidden xl:flex gap-8 text-textcol font-semibold mx-4 text-xl">
          <Link
          onClick={()=>setActiveSection('home')}
            className={pathname === "/"&&activeSection==='home' ? "text-contrasttext font-bold" : ""}
            href={"/"}
          >
            Home
          </Link>

          <Link
          onClick={()=>setActiveSection('community')}
            className={
              pathname === "/feed"||activeSection==='community' ? "text-contrasttext font-bold" : ""
            }
            href={"/feed"}
          >
            Community
          </Link>
          <Link
            className={
              pathname === "/top-events"||activeSection==='experience' ? "text-contrasttext font-bold" : ""
            }
            href={user ? "/top-events" : "#"}
            onClick={(e) => {
              if (!user) {
                setActiveSection('experience')
                e.preventDefault();
                if (pathname !== "/") {
                  router.push("/");
                  scrollToSection("events");
                } else {
                  scrollToSection("events");
                }
              }
            }}
          >
            Experiences
          </Link>

          {!user && (
            <Link
              className={
                pathname === "/"&&activeSection==='about' ? "text-contrasttext font-bold" : ""
              }
              href={"#"}
              onClick={(e) => {
                if (!user) {
                  setActiveSection('about')
                  e.preventDefault();
                  if (pathname !== "/") {
                    router.push("/");
                    scrollToSection("about");
                  } else {
                    scrollToSection("about");
                  }
                }
              }}
            >
              About
            </Link>
          )}

          <Link
          onClick={()=>{setActiveSection('contact')}}
            className={
              pathname === "/contact"|| activeSection==='contact' ? "text-contrasttext font-bold" : ""
            }
            href={"/contact"}
          >
            Contact
          </Link>
        </ul>
      </div>

      {!user && (
        <div className="md:hidden">
          <UserAvatar />
        </div>
      )}

      {user ? (
        <div className="flex gap-2 items-center px-2">
          <SearchBar />

          {!unwantedRoutes.includes(pathname) && (
            <Button className="border-[1px] bg-contrastbg hover:bg-contrastbg text-black p-0 rounded-lg border-[#E2E2E2] w-[35px] h-[35px] md:w-[35px] md:h-[35px]">
              <Bell />
            </Button>
          )}

          {!unwantedRoutes.includes(pathname) && (
            <Button
              className="rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold"
              onClick={() => {
                router.push(
                  activeLayout == "group"
                    ? "/feed/create-group/new"
                    : `/feed/create-post/new`
                );
              }}
            >
              {activeLayout == "group" ? "Create Group" : "Create Post"}
            </Button>
          )}
          <UserAvatar />
        </div>
      ) : (
        <div className="gap-2 hidden md:flex">
          <button
            className="bg-white rounded-full font-semibold py-3 px-6 shadow border-[0.5px] "
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/join-community")}
            className="bg-[#C9A74E] rounded-full py-3 px-6 font-semibold"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
