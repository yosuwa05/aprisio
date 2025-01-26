"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { UserAvatar } from "./useravatar";

export default function Topbar() {
  const router = useRouter();

  return (
    <nav className="w-full flex px-2 my-2 justify-between md:px-8">
      <div className="flex gap-2 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Menu size={22} className="xl:hidden" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure ?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <img src="/logo.png" className="w-[80px] xl:w-[120px]" alt="logo" />

        <ul className="hidden xl:flex gap-4 text-textcol font-semibold mx-4">
          <li>Home</li>
          <li>About Us</li>
          <li>Community</li>
          <li>Job</li>
          <li>Contact</li>
        </ul>
      </div>

      <div className="flex gap-2 items-center px-2">
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

        <Button className="border-[1px] bg-contrastbg lg:hidden rounded-lg text-black border-[#E2E2E2] w-[25px] h-[35px] md:w-[35px] md:h-[35px]">
          <Search className="w-2 h-2" />
        </Button>

        <Button className="border-[1px] bg-contrastbg hover:bg-contrastbg text-black p-0 rounded-lg border-[#E2E2E2] w-[35px] h-[35px] md:w-[35px] md:h-[35px]">
          <Bell />
        </Button>

        <Button
          className="rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold"
          onClick={() => router.push("/create-post")}
        >
          Create Post
        </Button>

        <UserAvatar />
      </div>
    </nav>
  );
}
