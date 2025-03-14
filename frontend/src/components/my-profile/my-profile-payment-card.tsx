"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import personImage from "@img/assets/person.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import { parseISO, format } from "date-fns";

export default function MyProfileCard({ ticket }: any) {
  const formattedDate = ticket?.eventId?.datetime
    ? format(parseISO(ticket.eventId.datetime), "MMM dd, yyyy HH:mm")
    : "Date not available";

  const router = useRouter();

  return (
    <div
      className='p-4 w-full rounded-lg flex items-center gap-4 transition-all bg-white shadow-md'
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      {/* <Image
        src={personImage}
        alt='person'
        width={60}
        height={60}
        className='rounded-lg'
      /> */}

      <div className='flex flex-col w-full'>
        <div className='flex justify-between items-center'>
          <h2
            onClick={() => {
              router.push(`/top-events/${ticket?.eventId?._id}`);
            }}
            className='font-semibold text-lg cursor-pointer'>
            {ticket?.eventId?.eventName}
          </h2>
          <Link
            target='_blank'
            href={`${BASE_URL}/events/generatepdf?id=${ticket?._id}`}
            className='flex gap-2 items-center text-sm text-contrasttext cursor-pointer '>
            <Icon icon='tabler:download' fontSize={22} />
            <h3 className='font-semibold text-sm'>Download</h3>
          </Link>
        </div>

        <div className='flex justify-between text-gray-600 gap-2 flex-wrap font-medium mt-2 font-roboto'>
          <p>Created: {formattedDate}</p>
          <p>Booked Tickets: {ticket?.ticketCount}</p>
        </div>
      </div>
    </div>
  );
}
