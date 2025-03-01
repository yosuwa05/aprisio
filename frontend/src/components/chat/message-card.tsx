import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useChatStore } from "@/stores/ChatStore";
import { format } from "date-fns";

export type Contact = {
  profile: {
    name: string;
    email: string;
    _id: string;
    image: string;
  };
  lastMessage: string;
  lastUpdated: number;
};

interface Props {
  contact: Contact;
}

function formatTimestamp(timestamp: number) {
  if (!timestamp) return "";
  return format(new Date(timestamp), "h:mm a");
}

export function MessageCard({ contact }: Props) {
  const updateChat = useChatStore((state) => state.setSelectedChat);

  return (
    <div
      className="flex items-center gap-4 p-2 justify-between cursor-pointer select-none hover:bg-gray-100 rounded-md"
      onClick={() =>
        updateChat({
          name: contact?.profile?.name,
          userId: contact?.profile?._id,
          selected: true,
        })
      }
    >
      <div className="flex gap-2 items-center">
        <Avatar className="h-9 w-9 bg-gray-400">
          <AvatarImage
            className="object-cover rounded-full"
            src={BASE_URL + `/file?key=${contact?.profile?.image}`}
          />
          <AvatarFallback>
            {makeUserAvatarSlug(contact?.profile?.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h5 className="text-textcol text-sm font-normal m-0 p-0">
            {contact.profile?.name}
          </h5>
          <p className="text-textcol/80 text-xs">
            {contact?.lastMessage ?? "No Messages Yet"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h5 className="text-textcol text-xs m-0 p-0">
          {formatTimestamp(contact?.lastUpdated)}
        </h5>
      </div>
    </div>
  );
}
