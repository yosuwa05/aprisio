"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function CommentSection() {
  const [typedComment, setTypedComment] = useState("");

  function handleSubmit() {
    console.log("Submitted comment:", typedComment);
  }

  return (
    <div className="mt-4 flex gap-4 items-center">
      <Avatar className="h-11 w-11">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Input
        placeholder="Write your comment"
        className="border-none bg-contrastbg text-[#828485] placeholder:text-sm"
        value={typedComment}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onChange={(e) => setTypedComment(e.target.value)}
      />
    </div>
  );
}
