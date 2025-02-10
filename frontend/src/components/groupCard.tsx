"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import personImage from "@img/assets/person.png";
import Image from "next/image";

interface IGroupCard {
  name: string;
  createdAt: string;
  groupAdmin: IAdmin;
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
      className="p-2 w-full rounded-lg transition-all"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex gap-2 w-full justify-between">
        <div className="flex gap-2 items-center">
          <Image
            src={personImage}
            alt="person"
            width={50}
            height={50}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h2>{group.name}</h2>

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

        <Button className="rounded-full bg-[#fcf7ea] text-black text-sm font-normal hover:bg-[#f7f2e6]">
          Join
        </Button>
      </div>
    </div>
  );
}
