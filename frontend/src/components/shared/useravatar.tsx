"use client";

import { _axios } from "@/lib/axios-instance";
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

export function UserAvatar() {
  const router = useRouter();

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

  function logout() {
    if (isPending) return;
    mutate();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
          <AvatarImage
            className=""
            src={user ? "/assets/person.png" : "/user.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
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
          <DropdownMenuItem className="cursor-pointer" onClick={logout}>
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
  );
}
