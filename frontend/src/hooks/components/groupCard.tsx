"use client";
import { Button } from "@/hooks/components/ui/button";
import { formatDate } from "@/lib/utils";
import personImage from "@img/assets/person.png";
import Image from "next/image";

interface IGroupCard {
  name: string;
  createdAt: string;
  groupAdmin: IAdmin;
  canJoin: boolean;
}

interface IAdmin {
  name: string;
}

interface Props {
  group: IGroupCard;
}

export default function GroupCard({ group }: Props) {
  return (
    <div
      className="p-4 w-full rounded-lg transition-all"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex gap-2 w-full justify-between items-center">
        <div className="flex gap-2 items-center justify-center">
          <Image
            src={personImage}
            alt="person"
            width={60}
            height={60}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2 pl-2">
            <h2 className="text-[#353535] font-semibold">{group.name}</h2>

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
          onClick={() => {}}
        >
          {group.canJoin ? "Join" : "View"}
        </Button>
      </div>
    </div>
  );
}
