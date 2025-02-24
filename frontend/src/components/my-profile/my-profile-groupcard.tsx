"use client";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import personImage from "@img/assets/person.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface IGroupCard {
  name: string;
  createdAt: string;
  groupAdmin: IAdmin;
  canJoin: boolean;
  slug: string;
  memberCount: number;
  _id: string;
}

interface IAdmin {
  name: string;
  _id: string;
}

interface Props {
  group: IGroupCard;
}

interface IGroup {
  id: string;
}

export default function MyProfileGroupCard({ group }: Props) {
  const router = useRouter();

  return (
    <div
      className='p-2 w-full rounded-lg transition-all'
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      <div className='flex gap-2 w-full items-center justify-between  h-[70px]'>
        <div className='flex gap-4 items-center'>
          <Image
            src={personImage}
            alt='person'
            width={50}
            height={50}
            className='rounded-lg'
          />

          <div className='flex flex-col gap-2'>
            <h2 className='font-semibold text-base lg'>{group?.name}</h2>

            <div className='flex gap-6 items-center justify-between'>
              <p className='text-[#043A53] text-xs font-medium'>
                {group?.memberCount} Member
              </p>
              <p className='text-gray-500 text-xs font-medium hidden lg:block'>
                <span className=''>Created</span> {formatDate(group?.createdAt)}
              </p>
              <p className='text-[#828485] text-xs font-medium'>
                Organized by{" "}
                <span className='font-bold text-[#636566]'>
                  {group?.groupAdmin?.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/groups/${group?.slug}`)}
          className={` rounded-3xl border-[0.2px] bg-[#FCF7EA]  hover:bg-[#FCF7EA] text-black`}>
          View
        </Button>
      </div>
    </div>
  );
}
