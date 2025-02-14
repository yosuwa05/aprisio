import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue, useIntersection } from "@mantine/hooks";
import { _axios } from "@/lib/axios-instance";
import { Skeleton } from "../ui/skeleton";
import GlobalLoader from "../globalloader";
import { useRouter } from "next/navigation";

type Props = {
  CloseSideBar: () => void;
};

export function TopicsSidebar({ CloseSideBar }: Props) {
  const user = useGlobalAuthStore((state) => state.user);
  const [topicSearch, setTopicSearch] = useState<string>("");
  const [debouncedTopicSearch] = useDebouncedValue(topicSearch, 400);
  const limit = 10;
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["communitysideBar", user?.id, debouncedTopicSearch],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/community?page=${pageParam}&limit=${limit}&userId=${user?.id}&topicName=${debouncedTopicSearch}`
        );
        return res?.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.topics?.length === limit ? nextPage : undefined;
      },
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const hasTopics = !isLoading && data?.pages?.[0]?.topics?.length > 0;

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  const SkeletonCard = () => (
    <div className='w-full p-2'>
      <div className='flex items-center justify-between'>
        <Skeleton className='w-3/4 h-[20px] rounded-md' />
        <Skeleton className='w-5 h-5 rounded-full' />
      </div>
      <div className='mt-2 space-y-1'>
        <Skeleton className='w-full h-[15px] rounded-md' />
        <Skeleton className='w-2/3 h-[15px] rounded-md' />
      </div>
    </div>
  );

  return (
    <main className='px-5'>
      <div className='flex gap-3 items-center'>
        <h1 className='my-4 font-bold text-2xl'>Filter</h1>
      </div>
      <div className=''>
        <div className='relative flex items-center'>
          <Search className='w-4 h-4 absolute left-3' />
          <Input
            className='pl-10 w-full h-[35px] border-[#E2E2E2] bg-contrastbg'
            placeholder='Search Community'
            name='search'
            id='search'
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
          />
        </div>
      </div>
      <aside className='pt-6 h-[calc(100vh-100px)] overflow-y-scroll hide-scrollbar pb-6'>
        {isLoading ? (
          Array(limit)
            .fill(0)
            .map((_, idx) => <SkeletonCard key={idx} />)
        ) : hasTopics ? (
          data?.pages?.flatMap((page) =>
            page?.topics?.map((post: any) => {
              const isOpen = openTopic === post._id;
              return (
                <Collapsible
                  className='py-2'
                  key={post._id}
                  open={isOpen}
                  onOpenChange={(open) => setOpenTopic(open ? post._id : null)}>
                  <CollapsibleTrigger className='w-full'>
                    <div className='flex justify-between items-center'>
                      <h1
                        className={`capitalize font-medium text-sm md:text-lg ${
                          isOpen
                            ? "text-contrasttext font-semibold"
                            : "text-fadedtext"
                        }`}>
                        {post.topicName}
                      </h1>
                      <Icon
                        className={`text-xl ${
                          isOpen ? "text-contrasttext" : "text-fadedtext"
                        }`}
                        icon={
                          isOpen
                            ? "octicon:chevron-up-12"
                            : "octicon:chevron-down-12"
                        }
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='pt-2 px-5 '>
                      {post?.subTopic?.map(
                        (subTopic: any, subTopicIndex: number) => (
                          <p
                            onClick={() => {
                              router.push(`/feed/explore/${subTopic?.slug}`);
                              CloseSideBar();
                            }}
                            key={subTopicIndex}
                            className='text-lg py-1 text-fadedtext capitalize cursor-pointer'>
                            {subTopic?.subTopicName}
                          </p>
                        )
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )
        ) : (
          <p className='text-gray-500 text-xs font-semibold'>No posts found</p>
        )}
        <div ref={ref} className='h-10'></div>
      </aside>

      {isLoading || isFetchingNextPage ? (
        <div className='flex justify-center items-center my-4'>
          <GlobalLoader />
        </div>
      ) : (
        <div></div>
      )}
    </main>
  );
}
