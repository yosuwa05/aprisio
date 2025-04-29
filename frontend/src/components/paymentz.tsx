"use client";

import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import chevronleft from "@img/icons/blue-chevron-left.svg";
import paymentfailed from "@img/images/paymentfailed.png";
import paymentsuccess from "@img/images/paymentsuccess.png";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const formatEventDate = (date: string) => {
  if (!date) return "";
  return format(new Date(date), "EEE, MMM d yyyy, h:mm a");
};

export function PaymentSuccess() {
  const params = useSearchParams();

  const status = params.get("status");
  const txnId = params.get("txnId");
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  const { data, isLoading } = useQuery<any>({
    queryKey: ["paynow broo"],
    queryFn: async () => {
      const res = await _axios.get(`/paymentz?status=${status}&txnId=${txnId}`);
      return res.data;
    },
  });

  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='min-h-screen py-5 w-full flex flex-col items-center justify-center px-4'>
      {!isLoading && data?.ok && (
        <div className='flex flex-col items-center text-center max-w-sm'>
          <Image
            loading='eager'
            src={paymentsuccess}
            alt='Payment Successful'
            className='object-contain h-60 w-60 max-w-full'
          />

          <div className='pt-10 flex flex-col gap-4 font-roboto'>
            <h1 className='text-3xl sm:text-4xl text-[#191818] font-semibold'>
              Payment Successful!
            </h1>
            <p className='text-lg text-[#7A7A7A]'>
              Your ticket has been confirmed.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !data?.ok && data?.message != "Ticket already sold" && (
        <div className='flex flex-col items-center text-center max-w-sm'>
          <Image
            loading='eager'
            src={paymentfailed}
            alt='Payment Failed'
            className='object-contain h-60 w-60 max-w-full'
          />

          <div className='pt-10 flex flex-col gap-4 font-roboto'>
            <h1 className='text-3xl sm:text-4xl text-[#191818] font-semibold'>
              Payment Failed!
            </h1>
            <p className='text-lg text-[#7A7A7A]'>Kindly try again.</p>
          </div>
        </div>
      )}

      {!isLoading && !data?.ok && data?.message == "Ticket already sold" && (
        <div className='flex flex-col items-center text-center max-w-sm'>
          <Image
            loading='eager'
            src={paymentsuccess}
            alt='Tickets Sold'
            className='object-contain h-60 w-60 max-w-full'
          />

          <div className='pt-10 flex flex-col gap-4 font-roboto'>
            <h1 className='text-xl  md:text-3xl sm:text-4xl text-[#191818] font-semibold'>
              Thanks for your purchase!
            </h1>
          </div>
        </div>
      )}

      {!isLoading && data?.ok && (
        <div className='border border-[#D7D7D7] p-5 sm:p-10 mt-10 rounded-lg w-full max-w-7xl'>
          <div className='flex flex-col gap-3 pb-6 sm:pb-8 border-b'>
            <h1 className='text-xl sm:text-2xl font-medium text-textcol font-roboto'>
              {data?.event?.eventName || ""}
            </h1>
            <h3 className='text-sm sm:text-lg text-[#64737A] font-roboto font-medium'>
              {formatEventDate(data?.event?.datetime)}
            </h3>
            <p className='text-textcol font-semibold text-sm sm:text-base'>
              Quantity: &nbsp; {data?.count} x {data?.event?.price}
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:gap-6 pb-6 sm:pb-8 border-b font-roboto mt-4'>
            <div className='flex items-center justify-between text-sm sm:text-lg'>
              <span className='text-[#7A7A7A]'>Transaction Date</span>
              <span className='text-[#362629] font-medium'>
                {formatEventDate(data?.transactionDate)}
              </span>
            </div>
            <div className='flex items-center justify-between text-sm sm:text-lg'>
              <span className='text-[#7A7A7A]'>Ticket Id</span>
              <span className='text-[#362629] font-medium uppercase'>
                {data?.tickets?.ticketId}
              </span>
            </div>
            <div className='flex items-center justify-between text-sm sm:text-lg'>
              <span className='text-[#7A7A7A]'>Subtotal</span>
              <span className='text-[#362629] font-medium'>
                ₹ {data?.subTotal}
              </span>
            </div>
            <div className='flex items-center justify-between text-sm sm:text-lg'>
              <span className='text-[#7A7A7A]'>Tax</span>
              <span className='text-[#362629] font-medium'>₹ {data?.tax}</span>
            </div>
          </div>

          <div className='flex items-center justify-between font-bold py-4 sm:py-5 text-lg sm:text-2xl'>
            <span className='text-[#7A7A7A]'>Total</span>
            <span className='text-[#362629] font-semibold'>
              ₹ {data?.amount}
            </span>
          </div>

          <p className='text-lg text-[#7A7A7A] text-center '>
            Your ticket is now available on your 'My Account' page under
            'Experiences'
          </p>
        </div>
      )}

      <div className='flex justify-center mt-6'>
        <Button
          onClick={() => {
            router.push("/profile");
            setActiveTab("payment");
          }}
          className='rounded-full py-8 px-7  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
          Back to Experiences
          <Image src={chevronleft} alt='chevron-left' />
        </Button>
      </div>
    </main>
  );
}
