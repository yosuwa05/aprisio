"use client";
import { _axios } from "@/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import desc from "@img/images/desc.png";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { RiArrowRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import mail from "../../../public/images/mail-icon.png";
import user from "../../../public/images/user-icon.png";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  email: z.string().email("Please enter a valid email"),
});

export default function ContactForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => _axios.post("/form/contact", data),
    onSuccess: (data) => {
      toast.success("Message sent successfully!");
      reset();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("An unexpected error occurred.");
    },
  });

  function onSubmit(data: any) {
    if (isPending) return;
    mutate(data);
  }

  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='lg:grid lg:grid-cols-2  md:gap-8 gap-5'>
        <div className='relative lg:py-0 py-3'>
          <Image
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
            src={user}
            alt=''
          />
          <input
            {...register("name")}
            type='text'
            placeholder='Name'
            className={`w-full lg:text-xl text-sm lg:pl-20 pl-10 pr-3 py-2 lg:h-20 h-[60px] border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          />
          {errors?.name && (
            <p className='text-red-500 absolute mt-1'>
              {errors.name.message?.toString()}
            </p>
          )}
        </div>
        <div className='relative lg:py-0 py-8'>
          <Image
            src={mail}
            alt='Email'
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
          />
          <input
            {...register("email")}
            type='email'
            placeholder='Email'
            className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />
          {errors?.email && (
            <p className='absolute text-red-500'>
              {errors.email.message?.toString()}
            </p>
          )}
        </div>

        <div className='relative col-span-2'>
          <Image
            src={desc}
            alt='Description'
            className='absolute lg:left-[3%] left-2  top-[40px] transform -translate-y-1/2 w-7 h-7'
          />
          <textarea
            {...register("message")}
            rows={5}
            placeholder='Type your message here'
            className={`w-full lg:text-xl text-base py-6 lg:pl-20 pl-10  pr-3 lg:h-20  border max-h-[250px] min-h-[250px] ${
              errors.message ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />
          {errors?.message && (
            <p className='absolute text-red-500'>
              {errors.message.message?.toString()}
            </p>
          )}
        </div>

        <div></div>

        <div className='flex group lg:justify-end  justify-center py-10 lg:py-0'>
          <button
            type='submit'
            className={`bg-[#043A53] text-xl ${
              isPending
                ? "cursor-not-allowed"
                : "group-hover:bg-[#e0a93a] hover:scale-110 transition-all duration-300"
            } text-white font-mulish font-bold py-4 px-7 rounded-full  transition duration-300`}>
            {isPending ? (
              <>
                <span className='flex gap-5 items-center '>
                  Submiting <ImSpinner2 className='animate-spin ' size={20} />
                </span>
              </>
            ) : (
              <>
                <span className='flex gap-5 items-center '>
                  Submit{" "}
                  <span className='text-white bg-[#1249628C] group-hover:bg-black/10 p-2 rounded-full'>
                    <RiArrowRightLine />
                  </span>
                </span>
              </>
            )}{" "}
          </button>
        </div>
      </form>
    </>
  );
}
