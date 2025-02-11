"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import personImage from "@img/assets/person.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IGroupCard {
  name: string;
  createdAt: string;
  groupAdmin: IAdmin;
  canJoin: boolean;
  slug: string;
}

interface IAdmin {
  name: string;
}

interface Props {
  group: IGroupCard;
}

export default function GroupCard({ group }: Props) {
  const router = useRouter();

  return (
    <div
      className="p-2 w-full rounded-lg transition-all"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex gap-2 w-full items-center justify-between  h-[70px]">
        <div className="flex gap-4 items-center">
          <Image
            src={personImage}
            alt="person"
            width={50}
            height={50}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">{group.name}</h2>

            <div className="flex gap-6 items-center justify-between">
              <p className="text-[#043A53] text-xs font-medium">1 Member</p>
              <p className="text-gray-500 text-xs font-medium">
                Created {formatDate(group.createdAt)}
              </p>
              <p className="text-[#828485] text-xs font-medium">
                Organized by{" "}
                <span className="font-bold text-[#636566]">
                  {group.groupAdmin.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          className={`${
            group.canJoin
              ? "bg-[#F2F5F6] border-[#043A53]"
              : "bg-[#FCF7EA] border-[#AF9654]"
          } rounded-3xl border-[0.2px]  hover:bg-[#FCF7EA] text-black`}
          onClick={() => {
            router.push(`/community/groups/${group.slug}`);
          }}
        >
          {group.canJoin ? "Join" : "View"}
        </Button>
      </div>
    </div>
  );
}
