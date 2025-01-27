"use client";

import Topbar from "@/components/shared/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { _axios } from "@/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
});

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState("text");

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(postSchema),
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      return await _axios.post("/authenticated/post/create", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Post created successfully");
        reset();
        router.push("/feed");
      } else {
        toast("An error occurred while creating post");
      }
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <div>
      <Topbar />

      <div className="mx-2 xl:mx-8">
        <h1 className="text-3xl font-semibold py-4 xl:text-5xl">Create Post</h1>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          value={activeTab}
          className=""
        >
          <TabsList className="bg-transparent mb-2">
            <TabsTrigger
              className="shadow-none text-fadedtext font-light text-lg px-4 xl:text-xl  data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:text-contrasttext"
              value="text"
            >
              Text
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none text-fadedtext font-light text-lg px-4 xl:text-xl  data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:text-contrasttext"
              value="media"
            >
              Image & Video
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none text-fadedtext font-light text-lg px-4 xl:text-xl  data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:text-contrasttext"
              value="link"
            >
              Link
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mx-2 xl:mx-8" value="text">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="">
                <Label htmlFor="title"></Label>
                <Input
                  placeholder="Title"
                  id="title"
                  className="h-16 rounded-2xl text-black text-lg"
                  {...register("title")}
                />
                <div className="text-fadedtext text-sm w-full text-right p-2">
                  {}/100
                </div>
              </div>
              <div>
                <Label htmlFor="content"></Label>
                <Textarea
                  id="content"
                  placeholder="Description..."
                  className="rounded-2xl !text-lg text-black"
                  rows={8}
                  {...register("description")}
                />
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button
                  className="rounded-full bg-[#FFFAF3] border-[#AF965447] border-[1px] text-[#534B04] shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold"
                  onClick={() => {}}
                  type="button"
                >
                  Save as Draft
                </Button>

                <Button
                  className="rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold"
                  type="submit"
                  disabled={isPending}
                >
                  Submit
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent className="mx-2 xl:mx-8" value="media">
            <div className="">
              <Label htmlFor="title"></Label>
              <Input
                placeholder="Title"
                id="title"
                className="h-16 rounded-2xl"
                onChange={(e) => {}}
              />
              <div className="text-fadedtext text-sm w-full text-right p-2">
                /100
              </div>
            </div>
            <div>
              <Label htmlFor="content"></Label>
              <Textarea
                id="content"
                placeholder="Description..."
                className="rounded-2xl"
                rows={8}
              />
            </div>
          </TabsContent>

          <TabsContent className="mx-2 xl:mx-8" value="link">
            <div className="">
              <Label htmlFor="link"></Label>
              <Input
                placeholder="Link"
                id="link"
                className="h-16 rounded-2xl"
                onChange={(e) => {}}
              />
              <div className="text-fadedtext text-sm w-full text-right p-2"></div>
            </div>
            <div>
              <Label htmlFor="content"></Label>
              <Textarea
                id="content"
                placeholder="Description..."
                className="rounded-2xl"
                rows={8}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
