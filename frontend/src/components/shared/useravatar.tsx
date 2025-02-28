"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export function UserAvatar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = useGlobalAuthStore((state) => state.user);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let res = await _axios.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      useGlobalAuthStore.getState().setUser(null);
      router.push("/login");
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
            <AvatarImage
              className="object-cover rounded-full"
              src={
                user
                  ? BASE_URL + `/file?key=${user?.image}`
                  : "/assets/person.png"
              }
            />
            <AvatarFallback>
              {makeUserAvatarSlug(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {user ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              My Account
            </DropdownMenuItem>
          ) : null}
          {user ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Logout
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center p-3">
              Do you really want to logout ?
            </DialogTitle>
            <DialogDescription>
              <div className="gap-2 justify-center flex">
                <Button variant={"secondary"} className="border-2">
                  Close
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    if (isPending) return;
                    mutate();
                  }}
                >
                  Yes
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
