"use client";

import { useState } from "react";
import { ChatContact } from "./chat-contacts";

export function ChatBase() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Online");

  return (
    <div className="min-h-[calc(100vh-350px)] flex flex-col  p-4 h-[calc(100vh-450px)] overflow-y-auto hide-scrollbar">
      <ChatContact />
    </div>
  );
}
