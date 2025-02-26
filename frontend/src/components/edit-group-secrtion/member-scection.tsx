import { _axios } from "@/lib/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import MemberCard from "./member-card";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import GlobalLoader from "../globalloader";
import { Button } from "../ui/button";
import Image from "next/image";
import personImage from "@img/assets/person.png";
import { ChevronRight } from "lucide-react";

type Props = {
  groupId: string;
};

export function GroupMembersSection({ groupId }: Props) {
  const limit = 10;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["group-members", groupId],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/group/members?groupid=${groupId}&page=${pageParam}&limit=${limit}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.members?.length === limit ? nextPage : undefined;
      },
    });

  return (
    <div className='my-4'>
      <main className=' h-[65vh] hide- w-full  overflow-y-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8 w-full '>
          {isLoading &&
            Array.from({ length: limit }).map((_, idx) => (
              <Skeleton key={idx} className='w-full h-[150px] rounded-lg' />
            ))}

          {!isLoading && data?.pages?.[0]?.members?.length === 0 && (
            <p className='text-fadedtext text-center text-sm mt-5'>
              No Members found
            </p>
          )}

          {!isLoading &&
            data?.pages?.flatMap((page) =>
              page?.members?.map((member: any) => (
                <MemberCard member={member} key={member?._id} />
              ))
            )}
        </div>

        {hasNextPage && (
          <div className='flex justify-center py-4'>
            <Button
              className='text-white rounded-2xl bg-buttoncol hover:bg-buttoncol px-6 py-2'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
