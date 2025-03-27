"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import eyeclose from "../../../public/icons/eye-close.svg";
import eye from "../../../public/icons/eye.svg";
import key from "../../../public/images/key.svg";
// import location from "../../../public/images/location-icon.png";
import mail from "../../../public/images/mail-icon.png";
import mobile from "../../../public/images/phone-icon.png";
import user from "../../../public/images/user-icon.png";
// import Script from 'next/script';
import { RiArrowRightLine } from "react-icons/ri";
// import { GiCheckMark } from 'react-icons/gi';
import { _axios } from "@/lib/axios-instance";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer } from "react-toastify";
import { toast } from "sonner";

interface OTPlessResponse {
  success: boolean;
  message?: string;
  data?: {
    mobile?: string;
  };
}

declare global {
  interface Window {
    OTPlessSignin: {
      initiate: (params: {
        channel: string;
        email: string;
      }) => Promise<OTPlessResponse>;
      authenticate: (params: {
        mobileCallback: (response: OTPlessResponse) => void;
        mobile: string;
      }) => void;
    };
    handleOTPlessSuccess?: () => void;
  }
}

const formSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    mobile: z
      .string({ required_error: "Mobile number is required" })
      .regex(/^\d+$/, "Please enter a valid number")
      .length(10, "Mobile number must be exactly 10 digits"),
    // address: z.string().optional(),
    terms: z
      .boolean({ required_error: "You must accept terms and conditions" })
      .refine((val) => val === true, "You must accept terms and conditions"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const JoinCommunityForm = () => {
  const [token, setToken] = useState<string | null>(null);

  const [emailFromParams, setEmailFromParams] = useState<string | null>(null);

  const [mobileVerified, setmobileVerified] = useState(false);
  // const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  //const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordsVisible, setPasswordsVisible] = useState({
    password: true,
    confirmPassword: true,
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // const emailValue = watch("email");
  const mobileValue = watch("mobile");

  useEffect(() => {
    // Check if the URL contains search parameters
    const searchParams = new URLSearchParams(window?.location?.search);

    if (searchParams.toString()) {
      // Check if search query exists
      const tokenParam = searchParams.get("token");
      const emailParam = searchParams.get("email");

      setToken(tokenParam || null);
      setEmailFromParams(emailParam || null);

      const storedName = localStorage.getItem("name");
      const storedAddress = localStorage.getItem("address");
      const storedMobile = localStorage.getItem("mobile");
      // Check local storage for aprisioEmail
      const storedEmail = localStorage.getItem("aprisioEmail");
      // const verifiedStatus = localStorage.getItem('verified');
      // const expirationTime = localStorage.getItem('verificationExpiration');

      // const currentTime = new Date().getTime();
      // Set the email input value if aprisioEmail exists
      if (storedName) setValue("name", storedName);
      if (storedAddress) setValue("address", storedAddress);
      if (storedMobile) setValue("mobile", storedMobile);
      if (storedEmail) {
        setValue("email", storedEmail);
      }

      if (tokenParam && emailParam) {
        verifyEmail(tokenParam, emailParam);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, emailFromParams]);

  const verifyEmail = async (tokenParam: string, emailParam: string | null) => {
    try {
      const response = await _axios.post("/verify/email/confirm", {
        token: tokenParam,
        email: emailParam,
      });
      const { success, message } = response.data;

      if (success) {
        const storedEmail = localStorage.getItem("aprisioEmail");
        if (storedEmail === emailParam) {
          localStorage.setItem("verified", "true");
          // const expirationTime = new Date().getTime() + 1 * 60 * 1000;
          // localStorage.setItem('verificationExpiration', expirationTime.toString());
          // setEmailVerified(true);
          const timeoutId = setTimeout(() => {
            // setEmailVerified(false);
            setValue("email", ""); // Clear the email input
            localStorage.removeItem("aprisioEmail");
            localStorage.removeItem("verified");
            localStorage.removeItem("name");
            localStorage.removeItem("address");
            localStorage.removeItem("mobile");
          }, 5 * 60 * 1000);

          return () => clearTimeout(timeoutId);
        } else {
          console.error(
            "Local storage email does not match the verified email."
          );
        }
      } else {
        console.error("Verification failed:", message);
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  useEffect(() => {
    if (mobileValue) {
      const isValid = mobileValue.length === 10 && /^\d+$/.test(mobileValue);
      //   setIsmobileValid(isValid);
      if (!isValid) setmobileVerified(false);
    } else {
      //   setIsmobileValid(false);
      setmobileVerified(false);
    }
  }, [mobileValue]);

  const onSubmit = async (data: object) => {
    console.log(data);
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await _axios.post("/form/submit", data);

      if (response.data.ok) {
        setIsLoading(false);
        toast.success(response.data.message);
        localStorage.removeItem("aprisioEmail");
        localStorage.removeItem("verified");
        localStorage.removeItem("name");
        // localStorage.removeItem("address");
        localStorage.removeItem("mobile");
        reset();

        router.push("/login");
      } else {
        setIsLoading(false);
        toast.error(response.data.message || "Some thing went wrong");
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 md:gap-8 gap-5'>
        {/* Name Input */}
        <div className='relative'>
          <Image
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
            src={user}
            alt=''
          />
          <input
            {...register("name")}
            type='text'
            // onChange={(e) => handleInputChange("name", e.target.value)}
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
        {/* Email Input */}
        <div className='relative'>
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
          {/* {isEmailValid && (
  <button
    type="button"
    onClick={() => handleSendVerification(emailValue)}
    // disabled={isLoading} // Uncomment if you want to disable button during loading
    className={`absolute right-3 font-semibold ${
      emailVerified
        ? "bg-[#0F8040] text-white lg:text-xl text-base lg:py-3 py-0.5 lg:pl-4 lg:pr-5 pr-3 pl-2"
        : "bg-[#F0B73F] lg:py-3 lg:px-6 px-2 py-0.5 text-2xl text-[#353535]"
    } py-3 px-6 lg:top-3 top-[18%] rounded-2xl font-mulish`}
  >
    {emailVerified ? (
      <p className="flex lg:gap-2 gap-1 items-center">
        <span className="lg:p-1.5 p-1 md:text-base text-xs rounded-full font-extrabold bg-white text-green-700">
          <GiCheckMark />
        </span>
        <span className="lg:text-[20px] text-[16px]">Verified</span>
      </p>
    ) : (
      isVerifying ? (
        <span className="lg:text-[20px] cursor-not-allowed flex gap-2 items-center text-[16px]">Verify<ImSpinner2 className="animate-spin " size={20} /></span> 
      ) : (
        <span className="lg:text-[20px] text-[16px]">Verify</span> 
      )
    )}
  </button>
)} */}

          {/* {emailVerificationSent && !emailVerified && (
          <p className="text-[#F0B73F] absolute mt-1 text-xs lg:text-sm">We<span>&apos;</span>ve sent the verification link to your given mail id. Please verify your email</p>
        )} */}
          {/* {emailVerified && <p className="text-green-500">Verified</p>} */}
          {errors?.email && (
            <p className='absolute text-red-500'>
              {errors.email.message?.toString()}
            </p>
          )}
        </div>

        {/* mobile Input */}
        <div className='relative'>
          <Image
            src={mobile}
            alt='mobile'
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-6 h-6'
          />
          <input
            {...register("mobile")}
            // onChange={(e) => handleInputChange("mobile", e.target.value)}
            type='text'
            placeholder='Mobile'
            inputMode='numeric'
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            }}
            className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border ${
              mobileVerified
                ? "border-green-500"
                : errors.mobile
                ? "border-red-500"
                : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />
          {/* {ismobileValid && !mobileVerified && (
          <button
            type="button"
                   inputMode="numeric"
            onClick={handlemobileVerifyClick}
            disabled={isLoading}
            className="absolute right-5 top-5 text-green-600"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        )} */}
          {/* {mobileVerified && <p className="text-green-500">Verified</p>} */}
          {errors?.mobile && (
            <p className='text-red-500 absolute'>
              {errors.mobile.message?.toString()}
            </p>
          )}
        </div>

        {/* Address Input */}
        {/* <div className="relative">
          <Image
            src={location}
            alt="Location"
            className="absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7"
          />
          <input
            {...register("address")}
            type="text"
            // onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Address"
            className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border ${
              errors.address ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />
          {errors.address && (
            <p className="text-red-500 absolute">
              {errors.address.message?.toString()}
            </p>
          )}
        </div> */}

        <div className='relative'>
          <Image
            src={key}
            alt='Key'
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
          />
          <input
            {...register("password")}
            type={passwordsVisible.password ? "password" : "text"}
            placeholder='Create Password'
            className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />

          <Image
            src={passwordsVisible.password ? eyeclose : eye}
            alt='Key'
            onClick={() =>
              setPasswordsVisible((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
            className='absolute cursor-pointer lg:right-[5%] right-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
          />
          {errors.password && (
            <p className='text-red-500 absolute'>
              {errors.password.message?.toString()}
            </p>
          )}
        </div>

        <div className='relative'>
          <Image
            src={key}
            alt='Key'
            className='absolute lg:left-[5%] left-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
          />
          <input
            {...register("confirmPassword")}
            type={passwordsVisible.confirmPassword ? "password" : "text"}
            placeholder='Confirm Password'
            className={`w-full lg:text-xl text-base lg:pl-20 pl-10 py-2  pr-3 lg:h-20 h-[60px] border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-2 focus:outline-none focus:ring-blue-500`}
          />

          <Image
            src={passwordsVisible.confirmPassword ? eyeclose : eye}
            alt='Key'
            onClick={() =>
              setPasswordsVisible((prev) => ({
                ...prev,
                confirmPassword: !prev.confirmPassword,
              }))
            }
            className='absolute cursor-pointer lg:right-[5%] right-2  top-[50%] transform -translate-y-1/2 w-7 h-7'
          />
          {errors.confirmPassword && (
            <p className='text-red-500 absolute'>
              {errors.confirmPassword.message?.toString()}
            </p>
          )}
        </div>

        <div className='lg:col-span-2 text-[#043A53] flex gap-2 flex-col'>
          <div>*All fields are mandatory</div>

          <div className='lg:col-span-2 text-[#043A53] md:w-[80%]'>
            * Our services are currently not available to the residents of the
            European Union. By accessing our services, you confirm that you are
            not a citizen of the European Union.
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className='mt-10 lg:flex lg:col-span-2 md:justify-between '>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <input
                  {...register("terms")}
                  type='checkbox'
                  className='appearance-none w-7 h-7 border border-[#043A538F] checked:bg-[#F2F5F6] rounded-full transition-all duration-200 cursor-pointer peer'
                  onChange={(e) => setValue("terms", e.target.checked)}
                />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none'>
                  <svg
                    className='w-5 h-5 -mt-1 text-[#043A53]'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M20 6L9 17L4 12' />
                  </svg>
                </div>
              </div>
              <p className='text-[#353535] -mt-1 text-xl'>
                I agree to the
                <span className='text-[#043A53] font-semibold cursor-pointer mx-2'>
                  <Link href={"/terms-of-use"} target='_blank'>
                    Terms of Use
                  </Link>
                </span>
                and
                <span className='text-[#043A53] font-semibold cursor-pointer ml-2'>
                  <Link href={"/privacy-policy"} target='_blank'>
                    Privacy Policy
                  </Link>
                </span>
              </p>
            </div>
            {errors.terms && (
              <p className='text-red-500 text-sm'>
                {errors.terms.message?.toString()}
              </p>
            )}
          </div>
          <div className='flex group lg:justify-end  justify-center py-10 lg:py-0'>
            <button
              type='submit'
              className={`bg-[#043A53] text-xl ${
                isLoading
                  ? "cursor-not-allowed"
                  : "group-hover:bg-[#e0a93a] hover:scale-110 transition-all duration-300"
              } text-white font-mulish font-bold py-4 px-7 rounded-full  transition duration-300`}>
              {isLoading ? (
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
        </div>
      </form>
    </>
  );
};

export default JoinCommunityForm;
