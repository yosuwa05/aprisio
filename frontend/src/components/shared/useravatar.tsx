"use client";

import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function UserAvatar() {
  const router = useRouter();

  const user = useGlobalAuthStore((state) => state.user);

  function logout() {
    useGlobalAuthStore.getState().setUser(null);
    router.push("/login");
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        ) : (
          <DropdownMenuItem
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
