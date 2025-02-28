"use client";

import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
export function UserAvatar() {
  const router = useRouter();

  const user = useGlobalAuthStore((state) => state.user);
  const [logoutOpen, setLogoutOpen] = useState(false);
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

  function logout() {
    if (isPending) return;
    mutate();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className='h-8 w-8 lg:h-10 lg:w-10'>
            <AvatarImage
              className='object-cover rounded-full'
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
              className='cursor-pointer'
              onClick={() => router.push("/profile")}>
              My Account
            </DropdownMenuItem>
          ) : null}
          {user ? (
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => setLogoutOpen(true)}>
              Logout
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => {
                router.push("/login");
              }}>
              Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className='max-w-sm w-full p-6'>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={logout}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
