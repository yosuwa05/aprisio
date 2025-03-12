import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  groupid: string;
};

export function UploadedImages({ groupid }: Props) {
  const limit = 10;
  const [open, setOpen] = useState<boolean>(false);
  const [imageId, setImageId] = useState<string>("");
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["uploaded-images", groupid],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await _axios.get(
        `/group/photos?groupid=${groupid}&page=${pageParam}&limit=${limit}`
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      const nextPage = allPages.length + 1;
      return lastPage?.photos?.length === limit ? nextPage : undefined;
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await _axios.delete(`/group/group-image?imageId=${imageId}`);
    },
    onSuccess(data) {
      toast(data.data.message || "Image Deleted successfully");
      refetch();
      setOpen(false);
      setImageId("");
    },
    onError(error: any) {
      console.log(error);
      toast.error(error.response.data.messsge);
    },
  });

  return (
    <div className='my-4 mx-2'>
      <h1 className='text-2xl font-semibold text-textcol pb-3 font-roboto'>
        Uploaded Images
      </h1>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='w-full h-[250px] bg-gray-300 rounded-lg animate-pulse'
            />
          ))}
        </div>
      ) : (
        <div className=' '>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  hide-scrollbar p-2'>
            {data?.pages?.flatMap((page) =>
              page?.photos?.map((photo: any, index: number) => (
                <div
                  className='relative border rounded-lg p-2 shadow-md bg-white'
                  key={photo?._id}>
                  <Trash2
                    onClick={() => {
                      setImageId(photo?._id);
                      setOpen(true);
                    }}
                    className='absolute top-4 right-4 z-10   cursor-pointer text-red'
                    color='red'
                  />
                  <div className='relative w-full h-[250px]'>
                    <Image
                      src={`${BASE_URL}/file?key=${photo.photo}`}
                      alt='Uploaded Image'
                      fill
                      className='object-contain rounded-lg'
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {hasNextPage && (
            <div className='sticky bottom-0 bg-white p-2 flex justify-center'>
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className='bg-buttoncol hover:bg-buttoncol text-white px-6 py-2 rounded-full'>
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              image from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className='py-1 flex justify-end gap-x-4'>
            <Button
              onClick={() => setOpen(false)}
              className='bg-transparent hover:bg-transparent  text-contrasttext'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                mutate();
              }}
              disabled={isPending}
              className='rounded-3xl text-white bg-buttoncol hover:bg-buttoncol'>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
