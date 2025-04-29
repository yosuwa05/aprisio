"use client";

import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellDot, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useState } from "react";

export const Notifications = () => {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const limit = 10;
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  const [open, setOpen] = useState(false);
  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await _axios.get(
        `/notification/all?page=${pageParam}&limit=${limit}&userId=${user?.id}`
      );
      return res?.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages?.length + 1;
      return lastPage?.notifications?.length === limit ? nextPage : undefined;
    },
  });

  const { data: isNewNotifcation, refetch: newRefetch } = useQuery({
    queryKey: ["notification-count"],
    queryFn: async () => {
      const res = await _axios.get(`/notification/isnew-notification`);
      return res?.data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 2000,
    gcTime: 1000 * 60 * 10,
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await _axios.patch("/notification/markasread", data);
    },
    onSuccess(data) {
      console.log(data);
      newRefetch();
    },
    onError(error: any) {
      // toast.error(error.response.data.error || "Something went wrong");
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className='relative inline-flex'>
          <Button
            onClick={() => {
              if (isNewNotifcation?.newNotification) {
                mutate();
              }
              refetch();
            }}
            className='border-[1px] bg-contrastbg hover:bg-contrastbg text-black p-0 rounded-lg border-[#E2E2E2] w-[35px] h-[35px] md:w-[35px] md:h-[35px]'
            type='button'>
            <Bell />
          </Button>
          {isNewNotifcation?.newNotification ? (
            <span className="absolute top-0.5 right-0.5 grid min-h-[12px] min-w-[12px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-500 py-1 px-1 text-xs font-medium leading-none text-white content-['']"></span>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent className='min-w-[400px] overflow-y-scroll'>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className='space-y-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-start gap-3 p-3'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-[120px]' />
                    <Skeleton className='h-3 w-[60px]' />
                  </div>
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-3 w-[80%]' />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex flex-col gap-2'>
          {!isLoading &&
            data?.pages?.flatMap((page) =>
              page?.notifications?.map((notification: any) => (
                <div
                  onClick={() => {
                    console.log(notification);
                    if (notification?.type === "new-event") {
                      setActiveTab("created-groups");
                      setOpen(false);
                      router.push(`/profile`);
                    } else if (notification?.type === "like" || "comment") {
                      setOpen(false);
                      router.push(`/feed/post/${notification?.post?.slug}`);
                    }
                  }}
                  key={notification._id}
                  className={`flex items-start border-[1px] border-slate-100 gap-6 cursor-pointer p-3 rounded-lg transition-colors ${
                    notification.read
                      ? "bg-background hover:bg-muted/50"
                      : "bg-muted/50 hover:bg-muted"
                  }`}>
                  <div className={`flex-shrink-0 rounded-full p-2`}>
                    <Icon icon={"ix:info"} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex justify-between items-start gap-2'>
                      <h4 className={`text-sm font-medium`}>
                        {notification.title}
                      </h4>
                      <time className='text-xs text-muted-foreground whitespace-nowrap'>
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                        })}
                      </time>
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mt-0.5'>
                      {notification.content}
                    </p>
                  </div>
                </div>
              ))
            )}
        </div>

        {hasNextPage && (
          <div className='flex justify-center mt-5'>
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              size={"sm"}>
              {isFetchingNextPage ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Load More..
                </div>
              ) : (
                <div className='flex items-center gap-2'>Load More..</div>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
