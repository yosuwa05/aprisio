"use client";

import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/chevron-left.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface IUSER {
  name: string;
  email: string;
  image?: string;
}

interface IUSERDATA {
  user: IUSER;
}

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  image: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

export function EditProfile() {
  const queryClient = useQueryClient();
  const userData: IUSERDATA | undefined = queryClient.getQueryData([
    "user personal",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useGlobalAuthStore((state) => state.user);

  const [file, setFile] = useState<any>(null);

  const renderedImage = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    else return "";
  }, [file]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.user.name,
        email: userData.user.email,
      });
    }
  }, [userData, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.put(
        `/myprofile/edit-profile?userId=${user?.id}`,
        data
      );
    },
    onSuccess(data) {
      toast.success("Profile updated successfully!");
    },
    onError(data) {
      toast.error("Some thing went wrong");
    },
  });

  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", file);
    mutate(formData);
  };

  return (
    <div className="px-4">
      <h1 className="text-xl font-semibold py-4 xl:text-3xl">Edit Profile</h1>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
              <div className="flex items-center justify-center w-full h-full">
                <Avatar
                  className="w-32 h-32 font-bold text-3xl text-white cursor-pointer rounded-none"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <AvatarImage
                    className="object-cover w-full h-full rounded-none"
                    src={
                      file
                        ? renderedImage
                        : BASE_URL + `/file?key=${user?.image}`
                    }
                  />
                  <AvatarFallback className="">
                    {makeUserAvatarSlug(userData?.user.name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        <input
          type="file"
          id="profile-image"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e as React.ChangeEvent<HTMLInputElement>)
          }
        />

        <div>
          <Label>User Name</Label>
          <Input className="w-full" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input disabled className="w-full" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            className="rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            Save
            <Image src={chevronleft} alt="chevron-left" />
          </Button>
        </div>
      </form>
    </div>
  );
}
