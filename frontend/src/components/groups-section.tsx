"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GroupCard from "./groupCard";
import { GlobalLoader } from "./shared/global-loader";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Button } from "./ui/button";
type Props = {
  isUserJoined: boolean;
};
export const GroupsSection = ({ isUserJoined }: Props) => {
  const user = useGlobalAuthStore((state) => state.user);
  const activeLayout = useGlobalLayoutStore((state) => state.activeLayout);
  const setActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );
  const { topic } = useParams();
  let layouts = ["post", "group", "event"];
  const router = useRouter();
  const { data: joined } = useQuery({
    queryKey: ["joined"],
    retry: false,
    staleTime: Infinity,
    enabled: user != null,
    queryFn: async () => {
      return await _axios.get(`/personal/joined-things`);
    },
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["groups" + user?.id, topic],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/noauth/group?page=${pageParam}&userId=${
            user?.id ?? ""
          }&subTopic=${topic}&limit=${10}`
        );
        return res;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        const { page, limit, total } = lastPage.data;
        const nextPage = page + 1;
        return nextPage * limit < total ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className='w-full flex justify-between px-4 py-2 items-center'>
        <div className=' md:flex   rounded-full  hidden bg-white border-[1px] border-[#043A53] p-2  shadow-md'>
          {layouts.map((layout, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveLayout(layout as any);
              }}
              className={`capitalize cursor-pointer px-8 ${
                layout == activeLayout
                  ? "bg-[#F2F5F6] text-[#043A53] py-2 rounded-full border-[0.2px] border-[#043A53]"
                  : "py-2 rounded-full"
              }`}>
              {layout}
            </div>
          ))}
        </div>
        <div className='flex justify-end w-full  md:w-fit'>
          <Button
            className='rounded-full    bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'
            onClick={() => {
              if (!user) {
                return toast.error("Login to continue");
              }
              if (isUserJoined === false) {
                return toast.error("You must join the community to create ");
              }
              router.push(
                activeLayout == "group"
                  ? "/feed/create-group/new"
                  : `/feed/create-post/new`
              );
            }}>
            {activeLayout == "group" ? "Create Group" : "Create Post"}
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-6 items-center p-1 lg:p-4'>
        {isLoading ? (
          <div className='flex flex-col gap-4 w-full '>
            {[...Array(1)].map((_, i) => (
              <div key={i} className='flex gap-4 w-full'>
                <Skeleton className='w-[50px] h-[50px] rounded-full' />
                <div className='flex flex-col gap-2 w-full'>
                  <Skeleton className='w-full h-[200px]' />
                  <Skeleton className='w-full h-[15px]' />
                  <Skeleton className='w-3/4 h-[15px]' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <Skeleton className='w-full h-[200px]' />
                  <Skeleton className='w-full h-[15px]' />
                  <Skeleton className='w-3/4 h-[15px]' />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.pages && data?.pages.length > 0 ? (
          data.pages.map((page, pageIndex) =>
            page.data.groups.length > 0 ? (
              page.data.groups.map((group: any, postIndex: number) => (
                <React.Fragment key={`${postIndex}`}>
                  <GroupCard group={group} />
                </React.Fragment>
              ))
            ) : (
              <p
                key={`${pageIndex}-no-groups`}
                className='text-gray-500 text-xs font-semibold'>
                Create a Group or Join a Group
              </p>
            )
          )
        ) : (
          <p className='text-gray-500'>Create a Group or Join a Group</p>
        )}

        <div ref={ref} className='h-1'></div>

        {isLoading || isFetchingNextPage ? <GlobalLoader /> : <div></div>}
      </div>
    </>
  );
};
