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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
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
  dateOfBirth: z.any({
    required_error: "The Date of Birth field is required.",
  }),
  gender: z.enum(["male", "female"]),
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
    setValue,
    watch,
    trigger,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      dateOfBirth: "",
      gender: "male",
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

  const handleDateChange = (date: any) => {
    const formattedDate = date ? dayjs(date).format("DD-MM-YYYY") : "";
    setValue("dateOfBirth", formattedDate);
    trigger("dateOfBirth");
  };

  const setUser = useGlobalAuthStore((state) => state.setUser);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.put(
        `/myprofile/edit-profile?userId=${user?.id}`,
        data
      );
    },
    onSuccess(data) {
      toast.success("Profile updated successfully!");
      setUser({
        image: data.data.image,
        email: user?.email ?? "",
        name: data.data.name,
        id: user?.id ?? "",
        mobileNumber: user?.mobileNumber ?? "",
      });
    },
    onError(data) {
      toast.error("Some thing went wrong");
    },
  });

  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (file) formData.append("image", file);
    console.log(data);
    // mutate(formData);
  };

  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold py-4 xl:text-3xl'>Edit Profile</h1>

      <div className='flex justify-center mb-8'>
        <div className='relative'>
          <div className='relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20'>
            <div className='flex items-center justify-center w-full h-full'>
              <Avatar
                className='w-32 h-32 font-bold text-3xl text-white cursor-pointer rounded-none'
                onClick={() => fileInputRef?.current?.click()}>
                <AvatarImage
                  className='object-cover w-full h-full rounded-none'
                  src={
                    file ? renderedImage : BASE_URL + `/file?key=${user?.image}`
                  }
                />
                <AvatarFallback className=''>
                  {makeUserAvatarSlug(userData?.user.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <input
        type='file'
        id='profile-image'
        className='hidden'
        ref={fileInputRef}
        accept='image/*'
        onChange={(e) =>
          handleFileChange(e as React.ChangeEvent<HTMLInputElement>)
        }
      />

      <form
        className='grid-cols-1  md:grid-cols-2 grid gap-3  md:gap-6 w-full'
        onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>User Name</Label>
          <Input className='w-full' {...register("name")} />
          {errors.name && (
            <p className='text-red-500 text-xs'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input disabled className='w-full' {...register("email")} />
          {errors.email && (
            <p className='text-red-500 text-xs'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label>Gender</Label>
          <Select
            value={watch("gender")}
            onValueChange={(value: any) => {
              setValue("gender", value);
              trigger("gender");
            }}>
            <SelectTrigger className='h-16 rounded-2xl text-fadedtext text-lg'>
              <SelectValue placeholder='Select Gender' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='male'>Male</SelectItem>
              <SelectItem value='female'>Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>DOB</Label>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale='en-gb'>
            <DesktopDatePicker
              format='DD-MM-YYYY'
              // defaultValue={
              //   data?.data?.application?.dateOfBirth
              //     ? dayjs(data?.data?.application?.dateOfBirth) // Ensure it's a Day.js object
              //     : null
              // }
              className='w-full rounded-md border-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-shadow focus:outline-none focus:ring-0'
              {...register("dateOfBirth")}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
          {errors.dateOfBirth && (
            <p className='px-2 text-xs font-normal text-validationerror font-ibm'>
              {errors.dateOfBirth.message as string}
            </p>
          )}
        </div>

        <div className='flex md:col-span-2 justify-center pt-4'>
          <Button
            className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol disabled:opacity-50 disabled:cursor-not-allowed'
            type='submit'>
            Save
            <Image src={chevronleft} alt='chevron-left' />
          </Button>
        </div>
      </form>
    </div>
  );
}
