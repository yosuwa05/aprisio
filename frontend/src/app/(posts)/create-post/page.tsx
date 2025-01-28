/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Topbar from "@/components/shared/topbar";
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
import { Textarea } from "@/components/ui/textarea";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/chevron-left.svg";
import pencil from "@img/icons/pencil.svg";
import trash from "@img/icons/trash.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
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

export default function CreatePost() {
  const [draftsModelOpen, setDraftsModelOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, reset, watch, handleSubmit, setValue } = useForm({
    resolver: zodResolver(postSchema),
  });
  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "");
  const urlValue = watch("url", "");

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

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post("/authenticated/post/create", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast("Post created successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ["projects" + user?.id] });
        router.push("/feed");
      } else {
        toast("An error occurred while creating post");
      }
    },
  });

  type Draft = {
    title: string;
    description: string;
    link: string;
    image?: any;
  };

  const { mutate: createDraft } = useMutation({
    mutationKey: ["createDraft"],
    mutationFn: async (data: Draft) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const formData = new FormData();

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("url", data.url);
    mutate(formData);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = ["Text", "Image & Video", "Link"];

  useEffect(() => {
    setValue("title", "");
    setValue("description", "");
    setValue("url", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageRendered = useMemo(() => {
    if (uploadedFile) {
      return URL.createObjectURL(uploadedFile);
    }
    return "";
  }, [uploadedFile]);

  return (
    <div>
      <Topbar />
      <div className="mx-2 xl:mx-8">
        <div className="flex justify-between items-end mx-2">
          <h1 className="text-3xl font-semibold py-4 xl:text-5xl">
            Create Post
          </h1>
          <Button
            className="rounded-full p-[20px] bg-[#FCF7EA] border-[#AF965447] font-bold border-[1px] text-[#534B04] shadow-none text-xs lg:text-sm hover:bg-buttoncol"
            onClick={() => {
              setDraftsModelOpen(true);
            }}
            type="button"
          >
            Drafts{" "}
            {!isLoading && drafts && drafts.length > 0 && (
              <span className="bg-[#534B04] text-[#FCF7EA] rounded-full px-2 py-1">
                {drafts.length}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {tabs.map((tab, index: number) => (
              <div key={tab} className="flex cursor-pointer">
                <div
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  className={`shadow-none text-fadedtext font-normal text-sm md:text-lg px-4 xl:text-xl ${
                    index == activeIndex ? "text-[#05151b] font-extrabold" : ""
                  }`}
                >
                  {tab}
                </div>
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
                className="h-16 rounded-2xl text-black text-lg"
                {...register("title")}
              />
              <div className="text-fadedtext text-sm w-full text-right p-2">
                {titleValue.length}/100
              </div>
            </div>

            {activeIndex == 0 && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Label htmlFor="content"></Label>
                <Textarea
                  id="content"
                  placeholder="Description..."
                  className="rounded-2xl !text-lg text-black p-4"
                  rows={4}
                  {...register("description")}
                />
              </motion.div>
            )}

            {activeIndex == 1 && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Label htmlFor="file"></Label>
                <div className="h-[130px] text-fadedtext cursor-pointer border rounded-lg text-lg flex justify-start p-4 items-start">
                  <h4>Upload a image</h4>
                </div>
              </motion.div>
            )}

            {activeIndex == 1 && uploadedFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Trash2
                  className="absolute top-4 right-4 cursor-pointer text-red"
                  color="red"
                  onClick={() => {
                    setUploadedFile(null);
                  }}
                />
                <Image
                  src={imageRendered}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-[300px] object-cover rounded-2xl"
                />
              </motion.div>
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
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Label htmlFor="url"></Label>
                <Input
                  placeholder="Link / URL"
                  id="url"
                  className="h-16 rounded-2xl text-black text-lg"
                  {...register("url")}
                />
              </motion.div>
            )}

            <div className="flex gap-6 justify-end mt-4">
              <Button
                className="rounded-full p-[25px] bg-[#FFFAF3] border-[#AF965447] border-[1px] text-[#534B04] shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold"
                onClick={() => {
                  if (!titleValue || !descriptionValue)
                    return toast("Please fill in all the fields");
                  createDraft({
                    description: descriptionValue,
                    title: titleValue,
                    link: urlValue,
                    image: uploadedFile ? uploadedFile : "",
                  });
                }}
                type="button"
              >
                Save as Draft
              </Button>

              <Button
                className="rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-xs lg:text-sm hover:bg-buttoncol"
                type="submit"
                disabled={isPending}
              >
                Submit
                <Image src={chevronleft} alt="chevron-left" />
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={draftsModelOpen} onOpenChange={setDraftsModelOpen}>
        <DialogContent className="w-full px-0">
          <DialogHeader>
            <DialogTitle className="text-3xl w-[95%] mx-auto">
              Drafts
              {!isLoading && ok && drafts && (
                <span className="text-xl ml-4 text-[#5D5A5A]">
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
                          className="text-xl cursor-pointer w-[90%] mx-auto flex justify-between items-center"
                          key={draft._id}
                        >
                          <div
                            className="flex flex-col items-start gap-2 mt-4 py-2"
                            onClick={() => {
                              setValue("title", draft.title);
                              setValue("description", draft.description);
                              setValue("url", draft.url);

                              setDraftsModelOpen(false);
                            }}
                          >
                            <div className="text-[#534B04] text-xl">
                              {draft.title}
                            </div>
                            <div className="text-contrasttext text-sm">
                              {draft.description}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Image
                              src={pencil}
                              alt="pencil"
                              className="cursor-pointer"
                            />
                            <Image
                              src={trash}
                              alt="trash"
                              className="cursor-pointer"
                              onClick={() => {
                                if (deletingDraft) return;
                                deleteDraft(draft._id);
                              }}
                            />
                          </div>
                        </div>
                        <div className="h-[0.5px] bg-[#888383]"></div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-xl cursor-pointer w-[90%] mx-auto flex justify-between items-center">
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
