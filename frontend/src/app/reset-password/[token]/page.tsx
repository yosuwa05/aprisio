"use client";

import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import chevronleft from "@img/icons/blue-chevron-left.svg";
import eyeclose from "@img/icons/eye-close.svg";
import eye from "@img/icons/eye.svg";
import key from "@img/images/key.svg";
import loginimage from "@img/images/login_img.webp";
import logo from "@img/images/logo.png";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema } from "../schema";

export default function LoginForm({}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });

  const router = useRouter();

  const { token } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let payload = {
        password: values.password,
        token: token,
      };
      const res = await _axios.post("/auth/confirm-reset-password", payload);
      return res;
    },
    onSuccess(data) {
      if (data && data.data.ok) {
        toast(data?.data?.message || "Password reset successfully");

        router.push("/login/");
      } else {
        toast.error(data.data.message || "An Error Occured");
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response.data.message || "An Error Occured");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return toast.error("Invalid token");
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
            Reset Password
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 mt-8"
          >
            <div className="relative">
              <Image
                src={key}
                alt="Password"
                className="absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7"
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border placeholder:text-[#2A4D5C] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
              />
              {errors?.password && (
                <p className="text-red-500 absolute mt-1">
                  {errors.password.message?.toString()}
                </p>
              )}

              <Image
                src={showPassword ? eyeclose : eye}
                alt="Key"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer lg:right-[5%] right-2 top-[50%] transform -translate-y-1/2 w-7 h-7"
              />
            </div>
            <div className="relative">
              <Image
                src={key}
                alt="Confirm Password"
                className="absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7"
              />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border placeholder:text-[#2A4D5C] ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
              />
              {errors?.confirmPassword && (
                <p className="text-red-500 absolute mt-1">
                  {errors.confirmPassword.message?.toString()}
                </p>
              )}

              <Image
                src={showConfirmPassword ? eyeclose : eye}
                alt="Key"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer lg:right-[5%] right-2 top-[50%] transform -translate-y-1/2 w-7 h-7"
              />
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
