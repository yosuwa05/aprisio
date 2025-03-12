"use client";

import GlobalLoader from "@/components/globalloader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import pencil from "@img/icons/pencil.svg";
import trash from "@img/icons/trash.svg";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [draftsModelOpen, setDraftsModelOpen] = useState(false);
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
  const descriptionValue = watch("description", "");
  const urlValue = watch("url", "");

  const activeGroup = useGlobalFeedStore((state) => state.activeGroup);

  const user = useGlobalAuthStore((state) => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading, data: { drafts, ok } = { drafts: [], ok: false } } =
    useQuery({
      queryFn: async () => {
        const res = await _axios.get("/drafts");
        return res.data;
      },
      queryKey: ["drafts"],
    });

  useEffect(() => {
    setSelectedGroupId({ slug: activeGroup });
  }, [activeGroup]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post("/authenticated/post/create-group-post", data);
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

  type Draft = {
    title: string;
    description: string;
    link: string;
    image?: any;
    selectedTopic: string;
  };

  const { mutate: createDraft } = useMutation({
    mutationKey: ["createDraft"],
    mutationFn: async (data: Draft) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);
      formData.append("selectedGroup", selectedGroupId.slug);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await _axios.post("/drafts/create", data);
      return res.data;
    },
    onSuccess: () => {
      toast("Draft Saved!");
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      reset();
    },
    onError: () => {
      toast("An error occurred while creating post");
    },
  });

  const { mutate: deleteDraft, isPending: deletingDraft } = useMutation({
    mutationKey: ["deleteDraft"],
    mutationFn: async (id: string) => {
      const res = await _axios.delete(`/drafts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast("Draft Deleted!");
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
    },
    onError: () => {
      toast("An error occurred while creating post");
    },
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
    mutate(formData);
  };

  const tabs = ["Text", "Image & Video", "Link"];

  useEffect(() => {
    setValue("title", "");
    setValue("description", "");
    setValue("url", "");
  }, []);

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

  function handleDraftClick(draft: {
    _id: string;
    title: string;
    description: string;
    url: string;
  }) {
    setValue("title", draft.title);
    setValue("description", draft.description);
    setValue("url", draft.url);

    setDraftsModelOpen(false);
  }

  return (
    <div>
      <div className='mx-2 xl:mx-12'>
        <div className='flex justify-between items-center xl:items-end mx-2'>
          <h1 className='text-3xl font-semibold py-4 xl:text-5xl'>
            Create Post
          </h1>

          <Button
            className='rounded-full p-[20px] bg-[#FCF7EA] border-[#AF965447] font-bold border-[1px] text-[#534B04] shadow-none text-xs lg:text-sm hover:bg-buttoncol'
            onClick={() => {
              setDraftsModelOpen(true);
            }}
            type='button'>
            Drafts{" "}
            {!isLoading && drafts && drafts.length > 0 && (
              <span className='bg-[#534B04] text-[#FCF7EA] rounded-full px-2 py-1'>
                {drafts.length}
              </span>
            )}
          </Button>
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
                      setSelectedGroupId(subTopic);
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 mt-6 mx-4'>
            <div className=''>
              <Label htmlFor='title'></Label>
              <Input
                placeholder='Title'
                id='title'
                className='h-16 rounded-2xl text-fadedtext text-lg'
                {...register("title")}
              />
              <div className='text-fadedtext text-sm w-full text-right p-2'>
                {titleValue.length}/100
              </div>
            </div>

            {activeIndex == 0 && (
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
            )}

            {activeIndex == 1 && (
              <div
                key={activeIndex}
                onClick={() => fileInputRef.current?.click()}>
                <Label htmlFor='file'></Label>
                <div className='h-[80px] text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-start p-4 items-center'>
                  <h4>Upload a image</h4>
                </div>
              </div>
            )}

            {activeIndex == 1 && uploadedFile && (
              <div className='relative'>
                <Trash2
                  className='absolute top-4 right-4 cursor-pointer text-red'
                  color='red'
                  onClick={() => {
                    setUploadedFile(null);
                  }}
                />
                <Image
                  src={imageRendered}
                  alt=''
                  width={100}
                  height={100}
                  className='w-full h-[300px] object-cover rounded-2xl'
                />
              </div>
            )}

            <input
              type='file'
              accept='image/*'
              className='hidden'
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
                <Label htmlFor='url'></Label>
                <Input
                  placeholder='Link / URL'
                  id='url'
                  className='h-16 rounded-2xl text-fadedtext text-lg'
                  {...register("url")}
                />
              </div>
            )}

            <div className='flex gap-6 justify-end mt-4'>
              <Button
                className='rounded-full p-[25px] bg-[#FFFAF3] border-[#AF965447] border-[1px] text-[#534B04] shadow-none text-sm hover:bg-buttoncol font-semibold'
                onClick={() => {
                  if (!titleValue || !descriptionValue || !selectedGroupId.slug)
                    return toast("Please fill in all the fields");

                  createDraft({
                    description: descriptionValue,
                    title: titleValue,
                    link: urlValue,
                    image: uploadedFile ? uploadedFile : "",
                    selectedTopic: selectedGroupId.slug,
                  });
                }}
                type='button'>
                Save as Draft
              </Button>

              <Button
                className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol'
                type='submit'
                disabled={isPending}>
                Submit
                <Image src={chevronleft} alt='chevron-left' />
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={draftsModelOpen} onOpenChange={setDraftsModelOpen}>
        <DialogContent className='w-full px-0'>
          <DialogHeader>
            <DialogTitle className='text-3xl w-[95%] mx-auto'>
              Drafts
              {!isLoading && ok && drafts && (
                <span className='text-xl ml-4 text-[#5D5A5A]'>
                  {drafts.length} / 5
                </span>
              )}
            </DialogTitle>
            <DialogDescription asChild key={"fragment"}>
              <div>
                {drafts && drafts.length > 0 && ok ? (
                  drafts.map(
                    (draft: {
                      _id: string;
                      title: string;
                      description: string;
                      url: string;
                    }) => (
                      <div key={draft._id}>
                        <div
                          className='text-xl cursor-pointer w-[90%] mx-auto flex justify-between items-center'
                          key={draft._id}>
                          <div
                            className='flex flex-col items-start gap-2 mt-4 py-2'
                            onClick={() => {
                              handleDraftClick(draft);
                            }}>
                            <div className='text-[#534B04] text-xl'>
                              {draft.title}
                            </div>
                            <div className='text-contrasttext text-sm'>
                              {draft.description}
                            </div>
                          </div>

                          <div className='flex gap-3'>
                            <Image
                              src={pencil}
                              alt='pencil'
                              className='cursor-pointer'
                              onClick={() => {
                                handleDraftClick(draft);
                              }}
                            />
                            <Image
                              src={trash}
                              alt='trash'
                              className='cursor-pointer'
                              onClick={() => {
                                if (deletingDraft) return;
                                deleteDraft(draft._id);
                              }}
                            />
                          </div>
                        </div>
                        <div className='h-[0.5px] bg-[#888383]'></div>
                      </div>
                    )
                  )
                ) : (
                  <div className='text-xl cursor-pointer w-[90%] mx-auto flex justify-between items-center'>
                    <p>No drafts</p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
