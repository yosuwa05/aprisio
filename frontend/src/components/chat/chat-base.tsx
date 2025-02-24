"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ChatContact } from "./chat-contacts";

export function ChatBase() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Online");

  return (
    <div className="min-h-[calc(100vh-350px)] flex flex-col gap-4 p-4 h-[calc(100vh-450px)] overflow-y-auto hidescroll">
      <div className="flex justify-between items-center border-b-[1px] mb-2">
        <h4 className="text-textcol font-semibold text-lg">Message</h4>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <span className="text-green-600 text-xs">{label}</span>{" "}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setLabel("Offline")}>
                Offline
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChatContact />
    </div>
  );
}
