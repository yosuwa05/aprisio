import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GroupCreatedEvents } from "./created-events";
import { GroupUserEvents } from "./user-events";

type Props = {
  groupId: string;
};

export function GroupEventSection({ groupId }: Props) {
  return (
    <div className='px-4 pb-5'>
      <h1 className='text-xl font-semibold  text-textcol   px-4 pb-3 xl:text-2xl'>
        Created Events
      </h1>
      <GroupCreatedEvents />
      <h1 className='text-xl font-semibold text-textcol  px-4 pb-3 mt-4 xl:text-2xl'>
        User Events
      </h1>
      <GroupUserEvents groupId={groupId} />
    </div>
  );
}
