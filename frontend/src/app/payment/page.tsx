import Image from "next/image";
import paymentsuccess from "../../../public/images/paymentsuccess.png";

export default function PaymentSuccess() {
  return (
    <main className='min-h-screen py-5 w-full flex flex-col items-center justify-center px-4'>
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

      <div className='border border-[#D7D7D7] p-5 sm:p-10 mt-10 rounded-lg w-full max-w-7xl'>
        <div className='flex flex-col gap-3 pb-6 sm:pb-8 border-b'>
          <h1 className='text-xl sm:text-2xl font-medium text-textcol font-roboto'>
            A Coffee Masterclass
          </h1>
          <h3 className='text-sm sm:text-lg text-[#64737A] font-roboto font-medium'>
            Sun, April 6 2025, 4:00 PM - 6:30 PM
          </h3>
          <p className='text-textcol font-semibold text-sm sm:text-base'>
            Quantity: &nbsp; {"5"} x {"500"}
          </p>
        </div>

        <div className='flex flex-col gap-4 sm:gap-6 pb-6 sm:pb-8 border-b font-roboto mt-4'>
          <div className='flex items-center justify-between text-sm sm:text-lg'>
            <span className='text-[#7A7A7A]'>Transaction Date</span>
            <span className='text-[#362629] font-medium'>
              Tuesday, 13 June 2023
            </span>
          </div>
          <div className='flex items-center justify-between text-sm sm:text-lg'>
            <span className='text-[#7A7A7A]'>Ticket ID</span>
            <span className='text-[#362629] font-medium'>TK-0254554584</span>
          </div>
          <div className='flex items-center justify-between text-sm sm:text-lg'>
            <span className='text-[#7A7A7A]'>Subtotal</span>
            <span className='text-[#362629] font-medium'>7500</span>
          </div>
          <div className='flex items-center justify-between text-sm sm:text-lg'>
            <span className='text-[#7A7A7A]'>Tax</span>
            <span className='text-[#362629] font-medium'>1350</span>
          </div>
        </div>

        <div className='flex items-center justify-between font-bold py-4 sm:py-5 text-lg sm:text-2xl'>
          <span className='text-[#7A7A7A]'>Total</span>
          <span className='text-[#362629] font-semibold'>8850</span>
        </div>
      </div>
    </main>
  );
}
