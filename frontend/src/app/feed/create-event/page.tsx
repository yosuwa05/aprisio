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
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
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
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const postSchema = z.object({
  location: z.string(),
  eventName: z.string(),
  eventType: z.enum(["online", "offline"]),
  eventTime: z.string(),
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
  const [selectedGroupId, setSelectedSubTopic] = useState<any>({
    _id: "",
    slug: "",
  });

  const [date, setDate] = useState<Date>();
  const activeGroup = useGlobalFeedStore((state) => state.activeGroup);
  const activeGroupId = useGlobalFeedStore((state) => state.activeGroupId);
  const [debouncedSubTopicSearch] = useDebouncedValue(subTopicSearch, 400);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      location: "",
      eventName: "",
      eventType: "online",
      eventTime: "",
      eventRules: {
        total: 1,
        events: [
          {
            heading: "",
            subHeading: "",
          },
        ],
      },
    },
  });

  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    setSelectedSubTopic({ _id: activeGroupId, slug: activeGroup });
  }, [activeGroup, activeGroupId]);
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post("/events/create", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Event created successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ["projects" + user?.id] });
        queryClient.invalidateQueries({
          queryKey: ["group-events", user?.id, selectedGroupId._id],
        });
        router.push("/groups/" + selectedGroupId.slug);
      } else {
        toast(data.data.message || "An error occurred while creating post");
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
    formData.append("eventType", data.eventType);
    formData.append("eventTime", data.eventTime);
    if (date) formData.append("eventDate", date.toISOString());
    formData.append("groupSelected", selectedGroupId._id);

    mutate(formData);
  };

  const { data, isLoading: isSubTopicsLoading } = useQuery({
    queryKey: ["groups for dropdown", debouncedSubTopicSearch, user?.id],
    queryFn: async () => {
      const res = await _axios.get(
        `/noauth/group/dropdown?limit=7&q=${debouncedSubTopicSearch}&userId=${user?.id}`
      );
      return res.data;
    },
  });

  const handleDeleteRule = (index: number) => {
    const currentEvents = watch("eventRules.events");
    if (currentEvents.length === 1) return; // Prevent deleting the last field

    // Create a new array without the deleted field
    const newEvents = currentEvents.filter((_, i) => i !== index);

    // Update the form state
    setValue("eventRules.events", newEvents);
    setValue("eventRules.total", newEvents.length);
  };

  const handleAddRule = () => {
    const currentEvents = watch("eventRules.events");

    setValue("eventRules.events", [
      ...currentEvents,
      { heading: "", subHeading: "" },
    ]);
    setValue("eventRules.total", currentEvents.length + 1);
  };

  return (
    <div className='mx-2 xl:mx-8'>
      <div className='flex justify-between items-center xl:items-end mx-2'>
        <h1 className='text-3xl font-semibold py-4 xl:text-5xl'>
          Create Event
        </h1>
      </div>

      <Popover open={subTopicOpen} onOpenChange={(e) => setSubTopicOpen(e)}>
        <PopoverTrigger asChild className='p-6'>
          <Button
            type='button'
            className='bg-[#F2F5F6] text-black border-[1px] border-[#043A53] rounded-3xl text-lg p-4 hover:bg-[#FCF7EA] my-3 mx-1'>
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
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='Time'></Label>
                <Input
                  placeholder='Location'
                  id='location'
                  type='time'
                  className='h-16 rounded-2xl text-fadedtext text-lg'
                  {...register("eventTime")}
                />
              </div>
              <div>
                <Label htmlFor='location'></Label>
                <Select
                  value={watch("eventType")}
                  onValueChange={(value) => {
                    setValue("eventType", value);
                    trigger("eventType");
                  }}>
                  <SelectTrigger className='h-16 rounded-2xl text-fadedtext text-lg'>
                    <SelectValue placeholder='Event Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='online'>Online</SelectItem>
                    <SelectItem value='offline'>Offline</SelectItem>
                  </SelectContent>
                </Select>
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

            {watch("eventRules.events")?.map((event, index) => (
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

                    {/* Conditionally render the trash button */}
                    {(index !== 0 || watch("eventRules.events").length > 1) && (
                      <div>
                        <Trash2
                          className='text-gray-500 cursor-pointer'
                          onClick={() => handleDeleteRule(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className='flex gap-4 justify-center mt-4'>
              <Button
                type='button'
                className='rounded-full bg-[#FCF7EA] text-black text-sm font-normal hover:bg-[#f7f2e6] border-[1px] '
                onClick={handleAddRule}>
                Add
                <PlusCircle />
              </Button>
            </div>
          </div>

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
  );
}
