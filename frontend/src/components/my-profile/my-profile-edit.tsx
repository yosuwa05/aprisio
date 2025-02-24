import { Button } from "../ui/button";
import { Input } from "../ui/input";
import chevronleft from "@img/icons/chevron-left.svg";
import Image from "next/image";
import { Label } from "../ui/label";
import profileimage from "@img/assets/person.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { _axios } from "@/lib/axios-instance";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
        image: userData.user.image || "",
      });
    }
  }, [userData, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected File:", file);
      //   setValue("image", file.name);
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
      console.log(data);
      toast.success("Profile updated successfully!");
    },
    onError(data) {
      console.log(data);
      toast.error("Some thing went wrong");
    },
  });

  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    console.log("Updated Data:", formData);
    formData.append("name", data.name);
    formData.append("email", data.email);
    mutate(formData);
  };

  return (
    <div className='px-4'>
      <h1 className='text-xl font-semibold py-4 xl:text-3xl'>Edit Profile</h1>
      <form
        className='flex flex-col gap-6 w-full'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-center'>
          <Image
            src={profileimage}
            className='rounded-full bg-white cursor-pointer'
            width={150}
            height={150}
            alt='Profile'
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type='file'
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div>
          <Label>User Name</Label>
          <Input className='w-full' {...register("name")} />
          {errors.name && (
            <p className='text-red-500 text-xs'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input className='w-full' {...register("email")} />
          {errors.email && (
            <p className='text-red-500 text-xs'>{errors.email.message}</p>
          )}
        </div>

        <div className='flex justify-end'>
          <Button
            className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol disabled:opacity-50 disabled:cursor-not-allowed'
            type='submit'
            disabled={!isDirty || isPending}>
            Save
            <Image src={chevronleft} alt='chevron-left' />
          </Button>
        </div>
      </form>
    </div>
  );
}
