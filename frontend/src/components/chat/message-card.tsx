import { useChatStore } from "@/stores/ChatStore";
import person from "@img/assets/person.png";
import Image from "next/image";

export type Contact = {
  name: string;
  email: string;
  _id: string;
};

interface Props {
  contact: Contact;
}

export function MessageCard({ contact }: Props) {
  const updateChat = useChatStore((state) => state.setSelectedChat);

  return (
    <div
      className="flex items-center gap-4 justify-between cursor-pointer select-none hover:bg-gray-100 p-2 rounded-md"
      onClick={() =>
        updateChat({
          name: contact.name,
          userId: contact._id,
          selected: true,
        })
      }
    >
      <div className="flex gap-2 items-center">
        <Image
          src={person}
          alt="person"
          width={40}
          height={40}
          className="rounded-full"
        />

        <div className="flex flex-col">
          <h5 className="text-textcol text-sm font-normal m-0 p-0">
            {contact.name}
          </h5>
          <p className="text-textcol/80 text-xs">Lorem ipsum</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h5 className="text-textcol text-xs m-0 p-0">16:34</h5>
        <div className="bg-green-400 rounded-full flex items-center justify-center w-5 h-5 text-xs font-semibold text-white">
          1
        </div>
      </div>
    </div>
  );
}
