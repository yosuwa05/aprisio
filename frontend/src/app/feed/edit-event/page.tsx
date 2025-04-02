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
import { _axios } from "@/lib/axios-instance";
import useEventStore from "@/stores/edit-section/EventStore";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import chevronleft from "@img/icons/chevron-left.svg";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const postSchema = z.object({
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

export default function NewEvent() {
  const [subTopicSearch, setSubTopicSearch] = useState("");
  const [subTopicOpen, setSubTopicOpen] = useState(false);
  const [selectedGroupId, setSelectedSubTopic] = useState({
    _id: "",
    slug: "",
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
  const currentEvent = useEventStore((state) => state.currentEvent);
  const activeTab = useGlobalLayoutStore(
    (state: any) => state.activeMyProfileTab
  );
  const { register, reset, handleSubmit, setValue } = useForm({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (currentEvent && currentEvent.eventName) {
      setValue("eventName", currentEvent.eventName || "");
      setValue("location", currentEvent.location || "");

      if (currentEvent.rules) {
        setEventRules({
          events: currentEvent.rules,
          total: currentEvent.rules.length,
        });
        setValue("eventRules.total", currentEvent.rules.length || 1);
        currentEvent.rules.forEach((event, index) => {
          setValue(`eventRules.events.${index}.heading`, event.heading || "");
          setValue(
            `eventRules.events.${index}.subHeading`,
            event.subHeading || ""
          );
        });
      } else {
        setEventRules({
          total: 1,
          events: [{ heading: "", subHeading: "" }],
        });
      }
      setDate(currentEvent.date ? new Date(currentEvent.date) : undefined);
      setSelectedSubTopic({
        _id: currentEvent.group?._id || "",
        slug: currentEvent.group?.slug || "",
      });
    }
  }, [currentEvent, setValue]);

  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.put("/events/edit", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Event updated successfully");
        reset();
        useEventStore.getState().resetCurrentEvent();
        queryClient.invalidateQueries({
          queryKey: ["my-profile-organised-events", user?.id, activeTab],
        });
        router.back();
      } else {
        toast(data.data.message || "An error occurred ");
      }
    },
  });

  const onSubmit = (data: any) => {
    if (!selectedGroupId._id) return toast("Please select a group");
    if (!date && data.eventName.length > 0)
      return toast("Please select a Event Date");

    const formData = new FormData();

    formData.append("eventName", data.eventName);
    formData.append("location", data.location);
    formData.append("eventRules", JSON.stringify(data.eventRules));
    if (date) formData.append("eventDate", date.toISOString());
    formData.append("groupSelected", selectedGroupId._id);
    formData.append("eventId", currentEvent.eventId);

    mutate(formData);
  };

  const { data, isLoading: isSubTopicsLoading } = useQuery({
    queryKey: ["groups for dropdown", debouncedSubTopicSearch],
    queryFn: async () => {
      const res = await _axios.get(
        `/noauth/group/dropdown?limit=10&q=${debouncedSubTopicSearch}&userId=${user?.id}`
      );
      return res.data;
    },
  });

  return (
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
          <h1 className='text-3xl font-semibold    xl:text-5xl'>Edit Event</h1>
        </div>
      </div>

      <Popover open={subTopicOpen} onOpenChange={(e) => setSubTopicOpen(e)}>
        <PopoverTrigger asChild className='p-6'>
          <Button
            type='button'
            className='bg-[#F2F5F6] capitalize  text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4 hover:bg-[#FCF7EA] my-3 mx-1'>
            {selectedGroupId.slug ? selectedGroupId.slug : "Select a Group"}
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
              data?.groups?.map((subTopic: any) => (
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 mt-4 mx-4'>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Label htmlFor='file'></Label>
                    <div className='text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-between p-4 items-center'>
                      {date ? format(date, "PPP") : <span>Pick a date</span>}

                      <Icon icon={"hugeicons:calendar-03"} />
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
                    <Label htmlFor={`heading-${index}`}></Label>
                    <Input
                      placeholder='Heading'
                      id={`heading-${index}`}
                      className='h-16 rounded-2xl text-fadedtext text-lg'
                      {...register(`eventRules.events.${index}.heading`)}
                    />
                  </div>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Label htmlFor={`subHeading-${index}`}></Label>
                    <Input
                      placeholder='Sub Heading'
                      id={`subHeading-${index}`}
                      className='h-16 rounded-2xl text-fadedtext text-lg'
                      {...register(`eventRules.events.${index}.subHeading`)}
                    />

                    <div>
                      <Trash2
                        className='text-gray-500 cursor-pointer'
                        onClick={() => {
                          if (eventRules.total == 1) return;
                          setEventRules((prev) => ({
                            events: prev.events.filter((_, i) => i !== index),
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

          <div className='flex gap-6 justify-end my-4'>
            <Button
              className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol'
              type='submit'
              disabled={isPending}>
              Update
              <Image src={chevronleft} alt='chevron-left' />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
