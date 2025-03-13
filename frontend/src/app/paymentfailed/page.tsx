"use client";
import Image from "next/image";
import paymentfailed from "../../../public/images/paymentfailed.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/feed");
    }, 500);
  }, []);

  return (
    <main className='min-h-screen py-5 w-full flex flex-col items-center justify-center px-4'>
      <div className='flex flex-col items-center text-center max-w-sm'>
        <Image
          loading='eager'
          src={paymentfailed}
          alt='Payment unsuccessful'
          className='object-contain h-60 w-60 max-w-full'
        />

        <div className='pt-10 flex flex-col gap-4 font-roboto'>
          <h1 className='text-3xl sm:text-4xl text-[#191818] font-semibold'>
            Payment Unsuccessful!
          </h1>
          <p className='text-lg text-[#7A7A7A]'>
            You will be redirected shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
