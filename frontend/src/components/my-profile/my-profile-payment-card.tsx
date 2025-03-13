"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import personImage from "@img/assets/person.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function MyProfileCard({ ticket }: any) {
  return (
    <div
      className='p-2 w-full rounded-lg flex items-center gap-4 transition-all bg-white shadow-md'
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      <Image
        src={personImage}
        alt='person'
        width={60}
        height={60}
        className='rounded-lg'
      />

      <div className='flex flex-col w-full'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-lg'>
            {ticket?.eventId?.eventName}
          </h2>
          <Button
            variant='ghost'
            className='flex gap-2 items-center text-sm text-contrasttext cursor-pointer '>
            <Icon icon='tabler:download' fontSize={22} />
            <h3 className='font-semibold text-sm'>Download</h3>
          </Button>
        </div>

        <div className='flex justify-between text-gray-600  font-medium mt-2 font-roboto'>
          <p>Created: {formatDate(ticket?.eventId?.datetime)}</p>
          <p>Booked Tickets: {ticket?.ticketCount}</p>
        </div>
      </div>
    </div>
  );
}
