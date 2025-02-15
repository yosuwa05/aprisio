import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import PersonCard from "./personCard";

type Props = {
  groupid: string;
};

export function PersonsSection({ groupid }: Props) {
  const user = useGlobalAuthStore((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["group-members", user?.id, groupid],
    queryFn: async () => {
      const res = await _axios.get(`/noauth/group/members?groupid=${groupid}`);
      return res.data;
    },
  });

  return (
    <div className='my-4'>
      <div className='mt-6 flex-col flex gap-4'>
        {isLoading ? (
          <div className='flex flex-col justify-center items-center my-4 gap-4'>
            <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
            <Skeleton className='w-full h-[100px]  min-w-[250px]'> </Skeleton>
            <Skeleton className='w-full h-[80px]  min-w-[250px]'> </Skeleton>
          </div>
        ) : (
          <div className='mx-2 flex gap-4 flex-col'>
            {data?.members &&
              data?.members.map((member: any, index: number) => (
                <PersonCard key={index} member={member} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
