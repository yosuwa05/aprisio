import { useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { _axios } from "@/lib/axios-instance";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronsDown, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

type Props = {
  searchKey: string;
  postId: string;
  CloseDialog: () => void;
};

export function ShareGroups({ searchKey, postId, CloseDialog }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const limit = 5;
  const subTopic = usePathname().split("/")[3];

  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["selected-groups", subTopic, user?.id, searchKey, limit],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/noauth/group?subTopic=${subTopic}&userId=${
            user?.id ?? ""
          }&page=${pageParam}&limit=${limit}&search=${searchKey}`
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.groups?.length === limit ? nextPage : undefined;
      },
    });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await _axios.post(`/group/share-post-group`, data);
    },
    onSuccess(data) {
      console.log(data);
      toast.success("Post shared successfully!");
      setSelectedGroups(new Set());
      console.log(selectedGroups, "selected");
      CloseDialog();
    },
    onError(error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    },
  });

  const handleCheckboxChange = (groupId: string) => {
    setSelectedGroups((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(groupId)) {
        newSelection.delete(groupId);
      } else {
        newSelection.add(groupId);
      }
      return newSelection;
    });
  };

  const handleShare = () => {
    if (selectedGroups.size === 0) {
      toast.error("Please select at least one group.");
      return;
    }

    mutate({
      groupIds: Array.from(selectedGroups),
      sharedBy: user?.id,
      postId,
    });
  };

  return (
    <main>
      <div className='flex flex-col gap-3'>
        {isLoading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className='flex gap-3 items-center'>
              <Skeleton className='w-8 h-8 rounded-md' />
              <Skeleton className='h-8 w-full' />
            </div>
          ))}

        {!isLoading && data?.pages?.[0]?.groups?.length === 0 && (
          <p className='text-fadedtext text-center text-sm mt-5'>
            No groups found
          </p>
        )}

        {!isLoading &&
          data?.pages?.flatMap((page) =>
            page?.groups?.map((group: any) => (
              <div key={group?._id} className='flex gap-3 items-center'>
                <Checkbox
                  className='scale-125 data-[state=checked]:bg-contrasttext data-[state=checked]:border-contrasttext'
                  checked={selectedGroups.has(group._id)}
                  onCheckedChange={() => handleCheckboxChange(group._id)}
                />
                <p className='text-textcol text-base md:text-lg font-medium'>
                  {group?.name}
                </p>
              </div>
            ))
          )}

        {hasNextPage && (
          <div className='flex justify-center'>
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant='ghost'
              size='icon'>
              {isFetchingNextPage ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                <ChevronsDown className='h-5 w-5' />
              )}
            </Button>
          </div>
        )}
        <div className='flex justify-end fixed bottom-5 right-5'>
          <Button
            onClick={handleShare}
            className='rounded-full bg-buttoncol text-black shadow-none text-xs lg:text-sm hover:bg-buttoncol font-semibold'>
            Share
          </Button>
        </div>
      </div>
    </main>
  );
}
