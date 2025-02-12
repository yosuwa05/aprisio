"use client";

import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import logosmall from "@img/images/final-logo.png";
import logo from "@img/images/logo.png";
import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { UserAvatar } from "./useravatar";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { topic } = useParams();

  const user = useGlobalAuthStore((state) => state.user);

  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);

  return (
    <nav className="w-full flex px-4 my-4 justify-between md:px-6 ">
      <div className="flex  items-center">
        <div className="flex gap-2">
          <Drawer>
            <DrawerTrigger asChild className="md:hidden">
              <div className="flex">
                <Menu size={24} />
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-[420px]">
              <DrawerHeader>
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>

              <div className="px-4 text-center">
                <div className="flex flex-col justify-between gap-6">
                  <ul className="flex flex-col gap-6 text-textcol font-semibold  text-xl">
                    <Link className="" href={"/"}>
                      Home
                    </Link>

                    <Link className="" href={"/community"}>
                      Community
                    </Link>
                    <Link className="" href={"#"}>
                      About Us
                    </Link>
                    <Link className="" href={"#"}>
                      Contact
                    </Link>
                  </ul>

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
              </div>
            </DrawerContent>
          </Drawer>
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
            className={pathname === "/" ? "text-contrasttext font-bold" : ""}
            href={"/"}
          >
            Home
          </Link>

          <Link
            className={
              pathname === "/feed" ? "text-contrasttext font-bold" : ""
            }
            href={"/feed"}
          >
            Community
          </Link>
          <Link
            className={pathname === "#" ? "text-contrasttext font-bold" : ""}
            href={"#"}
          >
            About Us
          </Link>
          <Link
            className={pathname === "#" ? "text-contrasttext font-bold" : ""}
            href={"#"}
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
          {pathname != "/" && (
            <div className="hidden lg:flex gap-2 items-center">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3" />
                <Input
                  className="pl-10 min-w-[400px] h-[35px] border-[#E2E2E2] bg-contrastbg"
                  placeholder="Search Posts & Comments"
                  name="search"
                  id="search"
                />
              </div>
            </div>
          )}

          {pathname != "/" && (
            <Button className="border-[1px] bg-contrastbg lg:hidden rounded-lg text-black border-[#E2E2E2] w-[25px] h-[35px] md:w-[35px] md:h-[35px]">
              <Search className="w-2 h-2" />
            </Button>
          )}

          {pathname != "/" && (
            <Button className="border-[1px] bg-contrastbg hover:bg-contrastbg text-black p-0 rounded-lg border-[#E2E2E2] w-[35px] h-[35px] md:w-[35px] md:h-[35px]">
              <Bell />
            </Button>
          )}

          {pathname != "/" && (
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
