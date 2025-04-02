"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import chevronleft from "@img/icons/blue-chevron-left.svg";
import chevronright from "@img/icons/blue-chevron-right.svg";
import logosmall from "@img/images/final-logo.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";
import { isSameDay, parseISO } from "date-fns";
const formatEventDate = (start: string, end: string) => {
  if (!start || !end) return "";
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  // Convert to UTC to avoid time zone shifts
  const startDateUTC = new Date(startDate.toISOString().split("T")[0]);
  const endDateUTC = new Date(endDate.toISOString().split("T")[0]);

  if (isSameDay(startDateUTC, endDateUTC)) {
    return `${formatInTimeZone(
      startDate,
      "UTC",
      "EEE, MMM d yyyy, h:mm a"
    )} to ${formatInTimeZone(endDate, "UTC", "h:mm a")}`;
  } else {
    return `${formatInTimeZone(
      startDate,
      "UTC",
      "EEE, MMM d yyyy, h:mm a"
    )} to ${formatInTimeZone(endDate, "UTC", "EEE, MMM d yyyy, h:mm a")}`;
  }
};
export default function BuyTickets() {
  const { topeventid } = useParams();
  const user = useGlobalAuthStore((state) => state.user);
  const [ticketCount, setTicketCount] = useState(1);
  const [isTicketSelect, SetIsTicketSelect] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isTermsClicked, setIsTermsClicked] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.name || "",
    emailId: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
  });

  const [isPaymentStarted, setPaymentStarted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["view-Admin-Event", topeventid],
    queryFn: async () => {
      const res = await _axios.get(
        `/events/noauth/viewadmin-event?eventId=${topeventid}`
      );
      return res.data;
    },
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        name: user.name || "",
        emailId: user.email || "",
        mobileNumber: user.mobileNumber,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (data?.event?.price) {
      const subtotal = data.event.price * ticketCount;
      const gstPercentage = data?.event?.gst || 0;
      const gst = (subtotal * gstPercentage) / 100;
      const total = subtotal + gst;
      setSubtotalAmount(subtotal);
      setGstAmount(gst);
      setTotalAmount(total);
    }
  }, [data, ticketCount]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate: payuData, isPending } = useMutation({
    mutationKey: ["payuData"],
    mutationFn: async (data: any) => {
      const res = await _axios.post("/payment/generateHash", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        let formHtml = data.formHtml;
        const payuFormContainer: any = document.getElementById("payuContainer");

        if (payuFormContainer) {
          payuFormContainer.innerHTML = formHtml;

          let form: any = document.getElementById("payuForm");
          setPaymentStarted(true);
          form.submit();
        }
      }
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message);
    },
  });

  function handlePayNow() {
    if (!isTermsClicked) {
      return toast.success("Please agree to the terms before proceeding.");
    }

    if (isPending) return;
    payuData({
      productInfo: "For Purchase of Ticket for " + data?.event?.eventName,
      amount: totalAmount,
      subTotal: subtotalAmount,
      tax: gstAmount,
      eventId: topeventid,
      tickets: ticketCount,
      name: userDetails.name,
      emailId: userDetails.emailId,
      mobileNumber: userDetails.mobileNumber,
    });
  }

  return (
    <main className='px-4 md:px-8 py-4 md:py-6 container mx-auto'>
      <div id='payuContainer' className='hidden'></div>
      <div className='flex  flex-col-reverse  lg:flex-row gap-10 pt-6'>
        <div className='w-full lg:w-1/4 flex-shrink-0'>
          <Image
            loading='eager'
            height={100}
            width={100}
            src={BASE_URL + `/file?key=${data?.event?.eventImage}`}
            alt='Event Image'
            className='w-full h-auto object-cover'
          />

          <div
            style={{ boxShadow: "15px 4px 60px 0px #02507C26" }}
            className='mt-4 w-fullrounded-lg bg-[#FFFFFF] p-6 rounded-lg'>
            <div className='flex gap-4 items-center'>
              <Image
                src={logosmall}
                className='w-[50px] cursor-pointer   '
                alt='logo'
              />
              <div className='flex flex-col gap-1'>
                <span className='text-textcol font-bold text-lg '>About</span>
                <span className='text-fadedtext text-sm'>Aprisio</span>
              </div>
            </div>
            <p className='font-normal text-lg pt-3 leading-8 break-words text-[#353535CC]/80  font-sans text-pretty whitespace-normal '>
              {data?.event?.biography}
            </p>
          </div>
        </div>

        <div className='lg:w-2/3'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-5'>
              <h1 className='text-3xl md:text-4xl font-normal text-textcol font-roboto'>
                {data?.event?.eventName || "Event Name"}
              </h1>
              {/* <h2 className='text-lg md:text-xl text-[#64737A]  font-roboto font-normal'>
                {data?.event?.eventName == "Aprisio Coffee Masterclass"
                  ? "Sun, Apr 6 2025 ,4:00 pm to 6:30 pm"
                  : formatDate(data?.event?.datetime)}
              </h2> */}
              <h2 className='text-lg md:text-xl text-[#64737A]  font-roboto font-normal'>
                {formatEventDate(
                  data?.event?.datetime,
                  data?.event?.enddatetime
                ) || ""}
              </h2>
            </div>
            <div className='text-[#353535CC]/60 font-extrabold font-roboto text-lg pb-4'>
              INR {data?.event?.price || ""} + GST
            </div>
          </div>

          <div
            style={{ boxShadow: "0px 2px 4px 0px #85858540" }}
            className='pt-3 bg-[#FFFFFF] p-6 rounded-lg'>
            <div className='flex flex-nowrap items-center gap-4 sm:gap-6 font-roboto overflow-x-auto'>
              <button
                onClick={() => setActiveStep(1)}
                className={`group flex items-center gap-2 sm:gap-3 rounded-lg border border-contrasttext/30 ${
                  activeStep === 2 && "border-none bg-transparent"
                } px-4 sm:px-5 py-2 transition-colors hover:bg-transparent focus:ring-3 focus:outline-none`}>
                <span
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-current bg-contrasttext ${
                    activeStep === 2 && "text-white bg-[#ADADAD]"
                  } text-base sm:text-lg font-normal text-white`}>
                  1
                </span>
                <span
                  className={`font-normal ${
                    activeStep === 2 ? "text-[#ADADAD]" : "text-contrasttext"
                  } text-lg sm:text-xl`}>
                  Details
                </span>
              </button>

              <button
                className={`group flex items-center gap-2 sm:gap-3 rounded-lg px-4 sm:px-5 py-2 transition-colors hover:bg-transparent focus:ring-3 focus:outline-none ${
                  activeStep === 2 && "border-contrasttext/30 border"
                }`}>
                <span
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-base sm:text-lg font-normal text-[#ADADAD] ${
                    activeStep === 2
                      ? "bg-contrasttext text-white"
                      : "border-[#ADADAD] bg-white"
                  }`}>
                  2
                </span>
                <span
                  className={`font-normal text-lg sm:text-xl ${
                    activeStep === 2 ? "text-contrasttext" : "text-[#ADADAD]"
                  }`}>
                  Payment
                </span>
              </button>
            </div>

            {activeStep === 1 && (
              <div>
                {!isTicketSelect && (
                  <div>
                    <div className='flex font-roboto flex-wrap justify-between md:justify-normal items-center gap-4  md:gap-16 pt-5'>
                      <h1 className='text-xl  md:text-2xl font-normal'>
                        Add Ticket
                      </h1>
                      <div className='flex items-center'>
                        <div className='flex items-center rounded-lg border-[2px] border-gray-400 bg-gray-100'>
                          <button
                            onClick={() => {
                              if (ticketCount <= 1) return;
                              setTicketCount((prev) => prev - 1);
                            }}
                            className='w-12 h-12 flex items-center justify-center text-xl text-textcol'>
                            −
                          </button>

                          <span className='w-12 h-12 flex items-center justify-center text-xl font-semibold text-textcol bg-gray-200'>
                            {ticketCount}
                          </span>

                          <button
                            onClick={() => {
                              setTicketCount((prev) => prev + 1);
                            }}
                            className='w-12 h-12 flex items-center justify-center text-xl text-textcol'>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-wrap font-roboto items-center gap-4 md:gap-24 pt-5 justify-between md:justify-normal'>
                      <h1 className=' md:text-2xl font-normal'>You Pay</h1>
                      <div className='flex items-center'>
                        <h1 className=' text-xl md:text-2xl font-normal'>
                          INR {subtotalAmount.toFixed(2)}
                        </h1>
                      </div>
                    </div>

                    <div className='pt-3'>
                      <p className='text-xs text-textcol/70'>
                        Your final amount will reflect on the payment page
                      </p>
                    </div>
                    <div className='mt-10'>
                      <Button
                        onClick={() => SetIsTicketSelect(true)}
                        className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
                        Submit
                        <Image src={chevronleft} alt='chevron-left' />
                      </Button>
                    </div>
                  </div>
                )}

                {isTicketSelect && (
                  <aside className='mt-4'>
                    <div className='grid md:grid-cols-2 gap-6 font-roboto'>
                      <div>
                        <Label className='text-base'>Name</Label>
                        <Input
                          name='name'
                          value={userDetails?.name}
                          onChange={handleInputChange}
                          className='pt-2'
                        />
                      </div>
                      <div>
                        <Label className='text-base'>Phone Number</Label>
                        <Input
                          type='number'
                          name='mobileNumber'
                          value={userDetails?.mobileNumber}
                          onChange={handleInputChange}
                          className='pt-2'
                        />
                      </div>
                      <div>
                        <Label className='text-base'>Email ID</Label>
                        <Input
                          name='emailId'
                          value={userDetails?.emailId}
                          onChange={handleInputChange}
                          className='pt-2'
                        />
                      </div>
                    </div>
                    <div>
                      <div className='mt-10 flex justify-between items-center'>
                        <Button
                          onClick={() => SetIsTicketSelect(false)}
                          className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
                          <Image src={chevronright} alt='chevron-right' />
                          Back
                        </Button>
                        <Button
                          onClick={() => {
                            if (
                              !userDetails?.name ||
                              !userDetails?.mobileNumber ||
                              !userDetails?.emailId
                            ) {
                              return toast.error("All the field is required");
                            }
                            if (
                              !/^[6-9]\d{9}$/.test(userDetails.mobileNumber)
                            ) {
                              return toast.error(
                                "Enter a valid mobile number."
                              );
                            }
                            setActiveStep(2);
                          }}
                          className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'>
                          Next
                          <Image src={chevronleft} alt='chevron-left' />
                        </Button>
                      </div>
                    </div>
                  </aside>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <article className='mt-6  md:mt-8   md:px-10'>
                <div className='grid gap-6  md:grid-cols-2'>
                  <div>
                    <h1 className='text-xl md:text-4xl font-normal text-[#000000] font-roboto'>
                      Order Summary
                    </h1>
                    <div className='mt-3  md:mt-8 flex flex-col gap-2  md:gap-4'>
                      <h1 className='text-lg md:text-2xl font-normal text-textcol font-roboto'>
                        {data?.event?.eventName || "Event Name"}
                      </h1>
                      <h2 className='text-base md:text-lg text-[#64737A]  font-roboto font-normal'>
                        {/* {formatEventDate(data?.event?.datetime)} */}
                      </h2>
                      <p className='text-textcol font-semibold'>
                        Quantity: &nbsp; {ticketCount} x {data?.event?.price}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h1 className='text-xl md:text-4xl font-normal text-[#000000] font-roboto'>
                      Subtotal
                    </h1>
                    <div className='mt-3  md:mt-8  font-roboto'>
                      <div className='flex justify-between items-center pb-2'>
                        <div className='text-[#64737A] text-lg  md:text-xl font-normal '>
                          Quantity x {ticketCount}
                        </div>
                        <div className='text-[#22292F] font-semibold  text-lg'>
                          {subtotalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className='flex justify-between items-center pb-6 border-b border-dashed'>
                        <div className='text-[#64737A] text-lg  md:text-xl font-normal '>
                          GST {data?.event?.gst}%
                        </div>
                        <div className='text-[#22292F] font-semibold  text-lg'>
                          {gstAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className='flex justify-between items-center py-2'>
                        <div className='text-[#22292F] text-xl font-normal  '>
                          Total
                        </div>
                        <div className='text-[#22292F] font-semibold  text-lg'>
                          {totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className='text-pretty whitespace-pre-wrap break-words font-roboto text-base font-normal pt-3'>
                        <input
                          checked={isTermsClicked}
                          id='terms'
                          onChange={() => setIsTermsClicked(!isTermsClicked)}
                          type='checkbox'
                          className='cursor-pointer'
                        />
                        &nbsp;{" "}
                        <label htmlFor='terms'>
                          By booking this experience, you agree to our 
                          <Link
                            className='hover:underline cursor-pointer'
                            href={"/terms-of-use?payment=true"}
                            target='_blank'>
                            Terms of Use
                          </Link>{" "}
                          {/* and{" "}
                          <Link
                            className="hover:underline cursor-pointer"
                            href={"/privacy-policy"}
                            target="_blank"
                          >
                            Privacy Policy
                          </Link> */}
                          .
                        </label>
                      </div>
                      <div className='mt-10 flex justify-end'>
                        <Button
                          onClick={handlePayNow}
                          className='rounded-full py-6 px-5  bg-contrasttext    text-white flex justify-between font-bold shadow-none text-sm hover:bg-contrasttext/90'
                          disabled={isPending || isPaymentStarted}>
                          Pay Now
                          <Image src={chevronleft} alt='chevron-left' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
