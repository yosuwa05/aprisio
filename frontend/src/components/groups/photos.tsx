import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  groupid: string;
};

export function PhotosSection({ groupid }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();
  const limit = 10;
  // const { data, isLoading } = useQuery({
  //   queryKey: ["group-photos", user?.id],
  //   queryFn: async () => {
  //     const res = await _axios.get(`/noauth/group/photos?groupid=${groupid}`);
  //     return res.data;
  //   },
  // });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["groups-photos", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/noauth/group/photos?groupid=${groupid}&userId=${
            user?.id ?? ""
          }&page=${pageParam}&limit=${limit}`
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.photos?.length === limit ? nextPage : undefined;
      },
    });

  console.log(data);

  return (
    <div className='my-4 mx-2'>
      {isLoading ? (
        <div className='grid grid-cols-3 gap-4'>
          {Array.from(Array(6).keys()).map((index) => (
            <div key={index} className='flex flex-col gap-2 items-center'>
              <div className='rounded-lg h-[300px] w-[300px] overflow-hidden' />
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-4 h-[calc(100vh-300px)]   overflow-y-auto'>
          {data?.pages?.flatMap((page) =>
            page?.photos?.map((photo: any, index: number) => (
              <div key={index} className='flex flex-col  items-center'>
                <Image
                  src={BASE_URL + `/file?key=${photo.photo}`}
                  alt='placeholder'
                  width={300}
                  height={300}
                  className='rounded-lg object-cover h-[200px] w-[300px]'
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
