import personImage from "@img/assets/person.png";
import Image from "next/image";

type Props = {
  member: Member;
};

type Member = {
  _id: string;
  userId: any;
  role: string;
};

export default function PersonCard({ member }: Props) {
  return (
    <div
      className="p-2 w-full rounded-lg transition-all cursor-pointer hover:scale-[1.01]"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div className="flex gap-2 w-full items-center justify-between  h-[70px]">
        <div className="flex gap-4 items-center">
          <Image
            src={personImage}
            alt="person"
            width={70}
            height={70}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h2 className="font-normal text-lg">{member.userId.name}</h2>

            <div className="flex gap-6 items-center justify-between">
              <p className="text-[#043A53] font-medium text-sm">
                12+ Joined Groups
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
