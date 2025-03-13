"use client";
import { Button } from "@/components/ui/button";
import chevronleft from "@img/icons/blue-chevron-left.svg";
import logosmall from "@img/images/final-logo.png";
import Image from "next/image";
import coffee from "../../../../public/images/coffee.jpg";

export default function BuyTickets() {
  return (
    <main className="px-4 md:px-8 py-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-10 pt-6">
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <Image
            loading="eager"
            src={coffee}
            alt="Event Image"
            className="w-full h-auto object-cover"
          />

          <div
            style={{ boxShadow: "15px 4px 60px 0px #02507C26" }}
            className="mt-4 w-fullrounded-lg bg-[#FFFFFF] p-6 rounded-lg"
          >
            <div className="flex gap-4 items-center">
              <Image
                src={logosmall}
                className="w-[50px] cursor-pointer   "
                alt="logo"
              />
              <div className="flex flex-col gap-1">
                <span className="text-textcol font-bold text-lg ">About</span>
                <span className="text-fadedtext text-sm">Aprisio</span>
              </div>
            </div>
            <p className="font-normal text-lg pt-3 leading-8 break-words text-[#353535CC]/80  font-sans text-pretty whitespace-normal ">
              Aprisio is launching India’s first Community platform for older
              adults with an exclusive Coffee Masterclass curated for older
              adults age 40
            </p>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl md:text-4xl font-medium text-textcol font-roboto">
                A Coffee Masterclass
              </h1>
              <h2 className="text-lg md:text-xl text-[#64737A]  font-roboto font-medium">
                Sun, April 6 2025, 4:00 PM - 6:30 PM
              </h2>
            </div>
            <div className="text-[#353535CC]/60 font-extrabold font-roboto text-lg pb-4">
              Starts at INR 15000
            </div>
          </div>

          <div
            style={{ boxShadow: "0px 2px 4px 0px #85858540" }}
            className="pt-3 bg-[#FFFFFF] p-6 rounded-lg"
          >
            <div className="flex items-center gap-4 font-roboto">
              <button className="group flex items-center gap-3 rounded-lg border border-contrasttext/30 px-5 py-2 transition-colors hover:bg-transparent focus:ring-3 focus:outline-none">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-current bg-contrasttext text-lg font-medium text-white">
                  1
                </span>
                <span className="font-medium text-contrasttext text-xl">
                  Details
                </span>
              </button>

              <button className="group flex items-center gap-3 rounded-lg px-5 py-2 transition-colors hover:bg-transparent focus:ring-3 focus:outline-none">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ADADAD] bg-white text-lg font-medium text-[#ADADAD]">
                  2
                </span>
                <span className="font-medium text-[#ADADAD] text-xl">
                  Payment
                </span>
              </button>
            </div>
            {/* step 1 */}
            <div>
              <div className='flex font-roboto items-center gap-16 pt-5'>
                <h1 className='text-2xl font-medium'>Add Ticket</h1>
                <div className='flex items-center'>
                  <div className='flex items-center rounded-lg border-[2px] border-gray-400 bg-gray-100'>
                    <button className='w-12 h-12 flex items-center justify-center text-xl text-textcol'>
                      −
                    </button>

                    <span className='w-12 h-12 flex items-center justify-center text-xl font-semibold text-textcol bg-gray-200'>
                      5
                    </span>

                    <button className='w-12 h-12 flex items-center justify-center text-xl text-textcol'>
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex font-roboto items-center gap-16 pt-5'>
                <h1 className='text-2xl font-medium'>You Pay</h1>
                <h1 className='text-2xl font-medium'>INR 7500.00</h1>
              </div>
              <div className='pt-3'>
                <p className='text-xs text-textcol/70'>
                  Your final amount will reflect on the payment page
                </p>
              </div>
              <div className='mt-10'>
                <Button
                  className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'
                  type='submit'>
                  Submit
                  <Image src={chevronleft} alt='chevron-left' />
                </Button>
              </div>
            </div>
            {/* <aside className='mt-4'>
              <div className='grid grid-cols-2 gap-6 font-roboto'>
                <div>
                  <Label className='text-base'>Name</Label>
                  <Input className='pt-2' />
                </div>
                <div>
                  <Label className='text-base'>Phone Number</Label>
                  <Input className='pt-2' />
                </div>
                <div>
                  <Label className='text-base'>Email ID</Label>
                  <Input className='pt-2' />
                </div>
              </div>
              <div>
                <div className='mt-10 flex justify-between items-center'>
                  <Button className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
                    <Image src={chevronright} alt='chevron-right' />
                    Back
                  </Button>
                  <Button className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
                    Next
                    <Image src={chevronleft} alt='chevron-left' />
                  </Button>
                </div>
              </div>
            </aside>

            {/* step 2 */}

            {/* <article className="mt-8 px-10">
              <div className="grid grid-cols-2">
                <div>
                  <h1 className="text-2xl md:text-4xl font-medium text-[#000000] font-roboto">
                    Order Summary
                  </h1>
                  <div className="mt-8 flex flex-col gap-4">
                    <h1 className="text-xl md:text-2xl font-medium text-textcol font-roboto">
                      A Coffee Masterclass
                    </h1>
                    <h2 className="text-base md:text-lg text-[#64737A]  font-roboto font-medium">
                      Sun, April 6 2025, 4:00 PM - 6:30 PM
                    </h2>
                    <p className="text-textcol font-semibold">
                      Quantity: 5 x 1500
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-medium text-[#000000] font-roboto">
                    Subtotal
                  </h1>
                  <div className="mt-8 font-roboto">
                    <div className="flex justify-between items-center pb-2">
                      <div className="text-[#64737A] text-xl font-medium ">
                        Quantity 5
                      </div>
                      <div className="text-[#22292F] font-semibold  text-lg">
                        7500
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-dashed">
                      <div className="text-[#64737A] text-xl font-medium ">
                        Quantity 5
                      </div>
                      <div className="text-[#22292F] font-semibold  text-lg">
                        7500
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div className="text-[#22292F] text-xl font-medium  ">
                        Total
                      </div>
                      <div className="text-[#22292F] font-semibold  text-lg">
                        8850
                      </div>
                    </div>
                    <div className="text-pretty whitespace-pre-wrap break-words font-roboto text-xl font-medium pt-3">
                      <Checkbox /> &nbsp; By booking this experience, you agree
                      to our terms & conditions.
                    </div>
                    <div className="mt-10 flex justify-end">
                      <Button className="rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90">
                        Pay Now
                        <Image src={chevronleft} alt="chevron-left" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article> */}
          </div>
        </div>
      </div>
    </main>
  );
}
