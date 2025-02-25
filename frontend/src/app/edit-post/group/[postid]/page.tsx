"use client";

import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/chevron-left.svg";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string(),
  url: z.string(),
});

export default function CreatePostGroup() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [subTopicSearch, setSubTopicSearch] = useState("");
  const [subTopicOpen, setSubTopicOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState({
    slug: "",
  });

  const [debouncedSubTopicSearch] = useDebouncedValue(subTopicSearch, 400);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, reset, watch, handleSubmit, setValue } = useForm({
    resolver: zodResolver(postSchema),
  });
  const titleValue = watch("title", "");

  const activeGroup = useGlobalFeedStore((state) => state.activeGroup);
  const user = useGlobalAuthStore((state) => state.user);

  const [deletedFile, setDeletedFile] = useState(false);

  const router = useRouter();
  const { postid } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedGroupId({ slug: activeGroup });
  }, [activeGroup]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post(
        "/authenticated/post/edit-group-post?postId=" + postid,
        data
      );
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Post created successfully");
        reset();
        queryClient.invalidateQueries({
          queryKey: ["groups-feed" + user?.id, selectedGroupId.slug],
        });
        router.push("/groups/" + selectedGroupId.slug);
      } else {
        toast(data.data.message || "An error occurred while creating post");
      }
    },
  });

  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const res = await _axios.get(
        "/authenticated/post/getsingle?postId=" + postid
      );
      return res.data;
    },
    retry: false,
  });

  const onSubmit = (data: any) => {
    if (!selectedGroupId.slug) return toast("Please select a group");

    const formData = new FormData();

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("url", data.url);
    formData.append("selectedgroup", selectedGroupId.slug);
    formData.append("deletedFile", deletedFile.toString());
    mutate(formData);
  };

  const tabs = ["Text", "Image & Video", "Link"];

  useEffect(() => {
    setValue("title", postData?.post?.title || "");
    setValue("description", postData?.post?.description || "");
    setValue("url", postData?.post?.url || "");

    if (postData?.post?.group) {
      setSelectedGroupId(postData?.post?.group);
    }
  }, [postData]);

  const imageRendered = useMemo(() => {
    if (uploadedFile) {
      return URL.createObjectURL(uploadedFile);
    }
    return "";
  }, [uploadedFile]);

  const { data, isLoading: isSubTopicsLoading } = useQuery({
    queryKey: ["groups for dropdown", debouncedSubTopicSearch],
    queryFn: async () => {
      const res = await _axios.get(
        `/noauth/group/dropdown?limit=7&q=${debouncedSubTopicSearch}`
      );
      return res.data;
    },
  });

  return (
    <div>
      <div className="mx-2 xl:mx-12">
        <div className="flex justify-between items-center xl:items-end mx-2">
          <h1 className="text-3xl font-semibold py-4 xl:text-5xl">Edit Post</h1>
        </div>

        <Popover open={subTopicOpen} onOpenChange={(e) => setSubTopicOpen(e)}>
          <PopoverTrigger asChild className="p-6">
            <Button
              type="button"
              className="bg-[#F2F5F6] text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4 hover:bg-[#FCF7EA] my-3 mx-1"
            >
              {selectedGroupId.slug ? selectedGroupId.slug : "Select a Group"}
              <ChevronDown className="mt-1 ml-2 text-black text-xl" size={60} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] ml-4 bg-[#F2F5F6] rounded-xl p-4 shadow-lg">
            <Input
              placeholder="Search..."
              className="w-full my-2"
              value={subTopicSearch}
              onChange={(e) => setSubTopicSearch(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              {isSubTopicsLoading && (
                <div className="flex justify-center items-center my-4">
                  <div>
                    <GlobalLoader />
                  </div>
                </div>
              )}
              {!isSubTopicsLoading &&
                data?.groups?.map((subTopic: any) => (
                  <div
                    key={subTopic._id}
                    className="flex cursor-pointer text-lg mx-4 text-black hover:bg-[#FCF7EA] rounded-lg p-[1px]"
                    onClick={() => {
                      setSubTopicSearch("");
                      setSubTopicOpen(false);
                      setSelectedGroupId(subTopic);
                    }}
                  >
                    <p className="text-black">{subTopic.slug}</p>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex flex-col md:gap-4">
          <div className="flex">
            {tabs.map((tab, index: number) => (
              <div
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={`flex cursor-pointer text-lg mx-4 ${
                  index != activeIndex
                    ? "text-fadedtext"
                    : "text-contrasttext font-bold"
                }`}
              >
                <h3>{tab}</h3>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-6 mx-4"
          >
            <div className="">
              <Label htmlFor="title"></Label>
              <Input
                placeholder="Title"
                id="title"
                className="h-16 rounded-2xl text-fadedtext text-lg"
                {...register("title")}
              />
              <div className="text-fadedtext text-sm w-full text-right p-2">
                {titleValue.length}/100
              </div>
            </div>

            {activeIndex == 0 && (
              <div key={activeIndex}>
                <Label htmlFor="content"></Label>
                <Textarea
                  id="content"
                  placeholder="Description..."
                  className="rounded-2xl !text-lg text-fadedtext p-4"
                  rows={4}
                  {...register("description")}
                />
              </div>
            )}

            {activeIndex == 1 && (
              <div
                key={activeIndex}
                onClick={() => fileInputRef.current?.click()}
              >
                <Label htmlFor="file"></Label>
                <div className="h-[80px] text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-start p-4 items-center">
                  <h4>Upload a image</h4>
                </div>
              </div>
            )}

            {activeIndex == 1 && uploadedFile && (
              <div className="relative w-[300px] h-[200px]">
                <Trash2
                  className="absolute top-4 right-4 cursor-pointer text-red"
                  color="red"
                  onClick={() => {
                    let elem: any = document.getElementById("file");
                    if (elem) elem.value = "";
                    setUploadedFile(null);
                  }}
                />
                <Image
                  src={imageRendered}
                  alt=""
                  width={100}
                  height={100}
                  className="w-[300px] h-[200px] object-cover rounded-2xl"
                />
              </div>
            )}

            {activeIndex == 1 &&
              !uploadedFile &&
              postData?.post?.image &&
              !deletedFile && (
                <div className="relative w-[300px] h-[200px]">
                  <Trash2
                    className="absolute top-4 right-4 cursor-pointer text-red"
                    color="red"
                    onClick={() => {
                      setUploadedFile(null);
                      setDeletedFile(true);
                    }}
                  />
                  <Image
                    src={BASE_URL + `/file?key=${postData?.post?.image}`}
                    alt=""
                    width={100}
                    height={100}
                    className="w-[300px] h-[200px] object-cover rounded-2xl"
                  />
                </div>
              )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setUploadedFile(file);
                }
              }}
              ref={fileInputRef}
            />

            {activeIndex == 2 && (
              <div key={activeIndex}>
                <Label htmlFor="url"></Label>
                <Input
                  placeholder="Link / URL"
                  id="url"
                  className="h-16 rounded-2xl text-fadedtext text-lg"
                  {...register("url")}
                />
              </div>
            )}

            <div className="flex gap-6 justify-end mt-4">
              <Button
                className="rounded-full py-[25px] w-[160px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol"
                type="submit"
                disabled={isPending}
              >
                Update Post
                <Image src={chevronleft} alt="chevron-left" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
