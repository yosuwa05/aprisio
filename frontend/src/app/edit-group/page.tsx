"use client";

import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/chevron-left.svg";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const postSchema = z.object({
  groupName: z.string().min(1).max(100),
  description: z.string(),
});

export default function CreateGroup() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [subTopicSearch, setSubTopicSearch] = useState("");
  const [subTopicOpen, setSubTopicOpen] = useState(false);
  const [selectedSubTopic, setSelectedSubTopic] = useState({
    slug: "",
  });

  const [debouncedSubTopicSearch] = useDebouncedValue(subTopicSearch, 400);

  const { register, reset, handleSubmit, setValue } = useForm({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    setValue("groupName", "");
    setValue("description", "");
  }, []);

  const activeSubTopic = useGlobalFeedStore((state) => state.activeSubTopic);

  useEffect(() => {
    setSelectedSubTopic({ slug: activeSubTopic });
  }, [activeSubTopic]);

  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post("/group/create", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Group created successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ["projects" + user?.id] });
        queryClient.invalidateQueries({
          queryKey: ["groups" + user?.id, selectedSubTopic?.slug],
        });
        router.back();
      } else {
        toast(data.data.message || "An error occurred while creating post");
      }
    },
  });

  const onSubmit = (data: any) => {
    if (!selectedSubTopic.slug) return toast("Please select a topic");

    const formData = new FormData();

    formData.append("groupName", data.groupName);
    formData.append("description", data.description);
    formData.append("subtopicId", selectedSubTopic.slug);

    mutate(formData);
  };

  const tabs = ["About", "Event", "Photos"];

  const { data, isLoading: isSubTopicsLoading } = useQuery({
    queryKey: ["subtopics for dropdown", debouncedSubTopicSearch],
    queryFn: async () => {
      const res = await _axios.get(
        `/subtopics/dropdown?limit=7&q=${debouncedSubTopicSearch}`
      );
      return res.data;
    },
  });

  return (
    <div>
      <div className='mx-2 xl:mx-8'>
        <div className='flex justify-between items-center xl:items-end mx-2'>
          <h1 className='text-3xl font-semibold py-4 xl:text-5xl'>
            Edit Group
          </h1>
        </div>

        <Popover open={subTopicOpen} onOpenChange={(e) => setSubTopicOpen(e)}>
          <PopoverTrigger asChild className='p-6'>
            <Button
              type='button'
              className='bg-[#F2F5F6] text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4 hover:bg-[#FCF7EA] my-3 mx-1'>
              {selectedSubTopic.slug ? selectedSubTopic.slug : "Select a Topic"}
              <ChevronDown className='mt-1 ml-2 text-black text-xl' size={60} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[300px] ml-4 bg-[#F2F5F6] rounded-xl p-4 shadow-lg'>
            <Input
              placeholder='Search...'
              className='w-full my-2'
              value={subTopicSearch}
              onChange={(e) => setSubTopicSearch(e.target.value)}
            />
            <div className='flex flex-col gap-2'>
              {isSubTopicsLoading && (
                <div className='flex justify-center items-center my-4'>
                  <div>
                    <GlobalLoader />
                  </div>
                </div>
              )}
              {!isSubTopicsLoading &&
                data?.subTopics?.map((subTopic: any) => (
                  <div
                    key={subTopic._id}
                    className='flex cursor-pointer text-lg mx-4 text-black hover:bg-[#FCF7EA] rounded-lg p-[1px]'
                    onClick={() => {
                      setSubTopicSearch("");
                      setSubTopicOpen(false);
                      setSelectedSubTopic(subTopic);
                    }}>
                    <p className='text-black'>{subTopic.slug}</p>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className='flex flex-col md:gap-4'>
          <div className='flex'>
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
                }`}>
                <h3>{tab}</h3>
              </div>
            ))}
          </div>

          {activeIndex == 0 && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4 mt-4 mx-4'>
              <div className='flex flex-col gap-4'>
                <div className=''>
                  <Label htmlFor='groupName'></Label>
                  <Input
                    placeholder='Group Name'
                    id='groupName'
                    className='h-16 rounded-2xl text-fadedtext text-lg'
                    {...register("groupName")}
                  />
                </div>
                <div key={activeIndex}>
                  <Label htmlFor='content'></Label>
                  <Textarea
                    id='content'
                    placeholder='Description...'
                    className='rounded-2xl !text-lg text-fadedtext p-4'
                    rows={4}
                    {...register("description")}
                  />
                </div>
              </div>

              <div className='flex gap-6 justify-end mt-4'>
                <Button
                  className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol'
                  type='submit'
                  disabled={isPending}>
                  Update
                  <Image src={chevronleft} alt='chevron-left' />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
