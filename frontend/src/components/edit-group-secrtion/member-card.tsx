import personImage from "@img/assets/person.png";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  member: Member;
};

type Member = {
  _id: string;
  role: string;
  name: string;
  joinedGroupsCount: number;
};

export default function MemberCard({ member }: Props) {
  return (
    <div
      className='p-2 w-full rounded-lg transition-all  hover:scale-[1.01]'
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}>
      <div className=' '>
        <div className='flex items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <Image
              src={personImage}
              alt='person'
              width={70}
              height={70}
              className='rounded-lg'
            />

            <div className='flex flex-col gap-2'>
              <h2 className='font-normal text-lg'>{member?.name}</h2>

              <div className='flex gap-6 items-center justify-between'>
                <p className='text-[#043A53] font-medium text-sm'>
                  {member?.joinedGroupsCount}+ Joined Groups
                </p>
              </div>
            </div>
          </div>
          <div className='flex text-contrasttext text-base font-medium '>
            {member?.role === "admin" ? "Admin" : ""}
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
