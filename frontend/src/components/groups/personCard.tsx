import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function PersonCard({ member }: any) {
  const router = useRouter();

  return (
    <div
      className="p-2 w-full rounded-lg transition-all  hover:scale-[1.01]"
      style={{
        boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
      }}
    >
      <div
        className="cursor-pointer"
        onClick={() => router.push("/user/" + member?.name)}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Avatar className="h-12 w-12 rounded-sm">
              <AvatarImage
                src={BASE_URL + `/file?key=${member?.image}`}
                className="h-12 w-12 object-cover rounded-sm"
              />
              <AvatarFallback>
                {makeUserAvatarSlug(member?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <h2 className="font-normal text-lg">
                {member?.name}
                <span className="text-xs ml-2 text-fadedtext font-bold">
                  {member?.role === "admin" ? "Admin" : ""}
                </span>
              </h2>

              <div className="flex gap-6 items-center justify-between">
                <p className="text-[#043A53] font-medium text-sm">
                  {member?.joinedGroups} Joined Groups
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
