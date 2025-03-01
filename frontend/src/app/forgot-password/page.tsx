"use client";

import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/blue-chevron-left.svg";
import loginimage from "@img/images/login_img.webp";
import logo from "@img/images/logo.png";
import mail from "@img/images/mail.png";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema } from "./schema";

export default function LoginForm({}) {
  const user = useGlobalAuthStore((state) => state.user);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await _axios.post("/auth/reset-password", values);
      return res;
    },
    onSuccess(data) {
      if (data && data.data.ok) {
        toast(data?.data?.message || "Password reset mail sent successfully");
      } else {
        toast.error(data.data.message || "An Error Occured");
      }
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "An Error Occured");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className={"h-screen overflow-hidden flex"}>
      <div
        className="h-full w-[1300px] hidden xl:block"
        style={{
          backgroundImage: `url(${loginimage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="h-screen mx-6 flex flex-col items-start justify-center w-full">
        <div className="w-[95%] xl:w-[70%] flex flex-col mx-auto md:max-w-[600px] min-w-[300px]">
          <Image
            src={logo}
            alt="Login Image"
            className="w-[200px] self-center xl:self-start cursor-pointer"
            onClick={() => router.push("/")}
          />

          <h1 className="text-3xl xl:text-5xl font-semibold mt-4">
            Forgot Password
          </h1>

          <p className="mt-4 text-gray-500">
            We will send a password reset link to your registered email address.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 mt-8"
          >
            <div className="relative">
              <Image
                src={mail}
                alt="Email"
                className="absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7"
              />
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border placeholder:text-[#2A4D5C] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
              />
              {errors?.email && (
                <p className="text-red-500 absolute mt-1">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>

            <div className="flex justify-between items-start">
              <div></div>

              <Button
                disabled={isPending}
                className="rounded-full py-[30px] w-[130px] bg-contrasttext text-white flex justify-between font-semibold shadow-none text-sm lg:text-sm hover:bg-contrasttext"
                type="submit"
              >
                {isPending ? "Submitting..." : "Submit"}
                {!isPending && <Image src={chevronleft} alt="chevron-left" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
