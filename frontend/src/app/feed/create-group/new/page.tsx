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
import { Icon } from "@iconify/react";

const postSchema = z.object({
  groupName: z.string().min(1).max(100),
  description: z.string(),
  location: z.string(),
  eventName: z.string(),
  eventRules: z.object({
    total: z.number(),
    events: z.array(
      z.object({
        heading: z.string(),
        subHeading: z.string(),
      })
    ),
  }),
});

export default function CreateGroup() {
  const [uploadedFiles, setUploadedFiles] = useState<File[] | []>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [subTopicSearch, setSubTopicSearch] = useState("");
  const [subTopicOpen, setSubTopicOpen] = useState(false);
  const [selectedSubTopic, setSelectedSubTopic] = useState({
    slug: "",
    subTopicName: "",
  });

  const [eventRules, setEventRules] = useState({
    total: 1,
    events: [
      {
        heading: "",
        subHeading: "",
      },
    ],
  });

  const [date, setDate] = useState<Date>();

  const [debouncedSubTopicSearch] = useDebouncedValue(subTopicSearch, 400);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, reset, handleSubmit, setValue } = useForm({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    setValue("groupName", "");
    setValue("description", "");
    setValue("location", "");
    setValue("eventName", "");
    setValue("eventRules", {
      total: 0,
      events: [],
    });
  }, []);

  const activeSubTopic = useGlobalFeedStore((state) => state.activeSubTopic);
  const activeSubTopicName = useGlobalFeedStore(
    (state) => state.activeSubTopicName
  );
  useEffect(() => {
    setSelectedSubTopic({
      slug: activeSubTopic,
      subTopicName: activeSubTopicName,
    });
  }, [activeSubTopic, activeSubTopicName]);

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
    if (!date && data.eventName.length > 0)
      return toast("Please select a Event Date");

    const formData = new FormData();

    if (uploadedFiles.length > 0) {
      for (let file of uploadedFiles) {
        formData.append("file", file);
      }
    }

    formData.append("groupName", data.groupName);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("eventName", data.eventName);
    formData.append("eventRules", JSON.stringify(data.eventRules));
    if (date) formData.append("eventDate", date.toISOString());
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
          <div className='flex justify-between gap-2  md:gap-3 items-center py-4'>
            <Button
              onClick={() => router.back()}
              variant={"outline"}
              size={"icon"}>
              <Icon
                onClick={() => router.back()}
                icon={"weui:back-filled"}
                className='text-4xl cursor-pointer '
              />
            </Button>
            <h1 className='text-3xl font-semibold    xl:text-5xl'>
              Create Group
            </h1>
          </div>
        </div>
        {selectedSubTopic?.slug && (
          <div className='px-3 py-2'>
            <Button className='bg-[#F2F5F6] capitalize  hover:bg-[#F2F5F6]  cursor-auto  text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4  my-3 mx-1'>
              {selectedSubTopic.slug
                ? selectedSubTopic.subTopicName
                : selectedSubTopic.slug
                ? selectedSubTopic.slug
                : "Select a Topic"}
            </Button>
          </div>
        )}
        {/* // ) : (
        //   <Popover open={subTopicOpen} onOpenChange={(e) => setSubTopicOpen(e)}>
        //     <PopoverTrigger asChild className='p-6'>
        //       <Button
        //         type='button'
        //         className='bg-[#F2F5F6] text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4 hover:bg-[#FCF7EA] my-3 mx-1'>
        //         {selectedSubTopic.slug
        //           ? selectedSubTopic.slug
        //           : "Select a Topic"}
        //         <ChevronDown
        //           className='mt-1 ml-2 text-black text-xl'
        //           size={60}
        //         />
        //       </Button>
        //     </PopoverTrigger>
        //     <PopoverContent className='w-[300px] ml-4 bg-[#F2F5F6] rounded-xl p-4 shadow-lg'>
        //       <Input
        //         placeholder='Search...'
        //         className='w-full my-2'
        //         value={subTopicSearch}
        //         onChange={(e) => setSubTopicSearch(e.target.value)}
        //       />
        //       <div className='flex flex-col gap-2'>
        //         {isSubTopicsLoading && (
        //           <div className='flex justify-center items-center my-4'>
        //             <div>
        //               <GlobalLoader />
        //             </div>
        //           </div>
        //         )}
        //         {!isSubTopicsLoading &&
        //           data?.subTopics?.map((subTopic: any) => (
        //             <div
        //               key={subTopic._id}
        //               className='flex cursor-pointer text-lg mx-4 text-black hover:bg-[#FCF7EA] rounded-lg p-[1px]'
        //               onClick={() => {
        //                 setSubTopicSearch("");
        //                 setSubTopicOpen(false);
        //                 setSelectedSubTopic({
        //                   slug: subTopic,
        //                   subTopicName: subTopic.subTopicName,
        //                 });
        //               }}>
        //               <p className='text-black'>{subTopic.slug}</p>
        //             </div>
        //           ))}
        //       </div>
        //     </PopoverContent>
        //   </Popover>
        // )} */}
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 mt-4 mx-4'>
            {activeIndex == 0 && (
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
                    placeholder='Description'
                    className='rounded-2xl !text-lg text-fadedtext p-4'
                    rows={4}
                    {...register("description")}
                  />
                </div>
              </div>
            )}

            {activeIndex == 1 && (
              <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div key={activeIndex}>
                          <Label htmlFor='file'></Label>
                          <div className='text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-start p-4 items-center'>
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor='location'></Label>
                    <Input
                      placeholder='Location'
                      id='location'
                      className='h-16 rounded-2xl text-fadedtext text-lg'
                      {...register("location")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='eventName'></Label>
                  <Input
                    placeholder='Event Name'
                    id='eventName'
                    className='h-16 rounded-2xl text-fadedtext text-lg'
                    {...register("eventName")}
                  />
                </div>

                <h3 className='mx-2 text-xl text-[#5D5A5A]'>Event Rules</h3>

                {Array.from(Array(eventRules.total).keys()).map((index) => (
                  <div key={index}>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='col-span-1'>
                        <Label htmlFor='heading'></Label>
                        <Input
                          placeholder='Heading'
                          id='heading'
                          className='h-16 rounded-2xl text-fadedtext text-lg'
                          {...register(`eventRules.events.${index}.heading`)}
                        />
                      </div>
                      <div className='col-span-2 flex items-center gap-2'>
                        <Label htmlFor='subHeading'></Label>
                        <Input
                          placeholder='Sub Heading'
                          id='subHeading'
                          className='h-16 rounded-2xl text-fadedtext text-lg'
                          {...register(`eventRules.events.${index}.subHeading`)}
                        />

                        <div>
                          <Trash2
                            className='text-gray-500 cursor-pointer'
                            onClick={() => {
                              if (eventRules.total == 1) return;
                              setEventRules((prev) => ({
                                events: prev.events.filter(
                                  (_, i) => i !== index
                                ),
                                total: prev.total - 1,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className='flex gap-4 justify-center mt-4'>
                  <Button
                    type='button'
                    className='rounded-full bg-[#FCF7EA] text-black text-sm font-normal hover:bg-[#f7f2e6] border-[1px] '
                    onClick={() => {
                      setEventRules((prev) => ({
                        ...prev,
                        total: prev.total + 1,
                      }));
                    }}>
                    Add
                    <PlusCircle />
                  </Button>
                </div>
              </div>
            )}

            {activeIndex == 1 && uploadedFiles?.length > 0 && (
              <div className='relative'>
                <Trash2
                  className='absolute top-4 right-4 cursor-pointer text-red'
                  color='red'
                  onClick={() => {
                    setUploadedFiles([]);
                  }}
                />
              </div>
            )}

            <input
              type='file'
              accept='image/*'
              className='hidden'
              multiple
              onChange={(event) => {
                const file = event.target.files;
                if (file && file.length > 0) {
                  setUploadedFiles([...uploadedFiles, ...file]);
                }
              }}
              ref={fileInputRef}
            />

            {activeIndex == 2 && (
              <div>
                <div
                  key={activeIndex}
                  onClick={() => fileInputRef.current?.click()}>
                  <Label htmlFor='file'></Label>
                  <div className='h-[80px] text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-start p-4 items-center'>
                    <h4>Upload a image</h4>
                  </div>
                </div>

                <div className='flex flex-wrap gap-4 my-4'>
                  {uploadedFiles.map((file, index) => (
                    <div
                      className='relative w-[200px] border-2 rounded-md p-3'
                      key={index}>
                      <Trash2
                        className='absolute top-4 right-4 cursor-pointer text-red'
                        color='red'
                        onClick={() => {
                          setUploadedFiles(
                            uploadedFiles.filter((_, i) => i !== index)
                          );
                        }}
                      />
                      <Image
                        src={URL.createObjectURL(file)}
                        alt=''
                        width={30}
                        height={100}
                        className='w-full h-[200px] object-cover rounded-2xl'
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='flex gap-6 justify-end mt-4'>
              <Button
                className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol'
                type='submit'
                disabled={isPending}>
                Create
                <Image src={chevronleft} alt='chevron-left' />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
