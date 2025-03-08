// "use client";

// import { TopicsCard } from "@/components/community/topics-card";
// import GlobalLoader from "@/components/globalloader";
// import { Skeleton } from "@/components/ui/skeleton";
// import { _axios } from "@/lib/axios-instance";
// import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
// import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
// import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
// import { useIntersection } from "@mantine/hooks";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";

// export default function Community() {
//   const user = useGlobalAuthStore((state) => state.user);
//   const updateActiveSubTopic = useGlobalFeedStore(
//     (state) => state.setActiveSubTopic
//   );
//   const updateActiveLayout = useGlobalLayoutStore(
//     (state) => state.setActiveLayout
//   );

//   useEffect(() => {
//     updateActiveSubTopic("");
//     updateActiveLayout("post");
//   }, []);
//   const limit = 5;
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
//     useInfiniteQuery({
//       queryKey: ["community", user?.id],
//       queryFn: async ({ pageParam = 1 }) => {
//         const res = await _axios.get(
//           `/community?page=${pageParam}&limit=${limit}&userId=${user?.id}`
//         );
//         return res;
//       },
//       initialPageParam: 1,
//       getNextPageParam: (lastPage, allPages) => {
//         const nextPage = allPages?.length + 1;
//         return lastPage?.events?.length === limit ? nextPage : undefined;
//       },
//     });

//   console.log(data);

//   const hasevents = !isLoading && data?.pages?.[0]?.events?.length > 0;

//   const containerRef = useRef<HTMLDivElement>(null);
//   const { ref, entry } = useIntersection({
//     root: containerRef.current,
//     threshold: 1,
//   });

//   useEffect(() => {
//     if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   return (
//     <>
//       <div className='mx-2 md:mx-12 mt-6'>

//         {isLoading ? (
//           <div className='flex flex-col gap-4 w-full '>
//             {[...Array(2)].map((_, i) => (
//               <div key={i} className='flex gap-4 w-full'>
//                 <Skeleton className='w-[50px] h-[50px] rounded-full' />
//                 <div className='flex flex-col gap-2 w-full'>
//                   <Skeleton className='w-full h-[200px]' />
//                   <Skeleton className='w-full h-[15px]' />
//                   <Skeleton className='w-3/4 h-[15px]' />
//                 </div>

//                 <div className='flex flex-col gap-2 w-full'>
//                   <Skeleton className='w-full h-[200px]' />
//                   <Skeleton className='w-full h-[15px]' />
//                   <Skeleton className='w-3/4 h-[15px]' />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : hasevents ? (
//           data?.pages?.flatMap((page) =>
//             page?.events?.map((event: any, index: number) => {
//               return (
//                 <div key={`${pageIndex}-${postIndex}`}>
//                   <h1 className='my-4 font-bold text-2xl'>{post.topicName}</h1>
//                   <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1   gap-4'>
//                     {post.subTopic.map(
//                       (subTopic: any, subTopicIndex: number) => (
//                         <TopicsCard
//                           key={subTopicIndex}
//                           subTopicName={subTopic.subTopicName}
//                           description={subTopic.description}
//                           subTopicId={subTopic._id}
//                           joined={subTopic.joined}
//                           slug={subTopic.slug}
//                           groupCount={subTopic.groupCount}
//                           totalEvents={subTopic.totalEvents}
//                         />
//                       )
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )
//         ) : (
//           <div className='flex flex-col justify-center items-center gap-4'>
//             <p className='text-gray-500 text-xs font-semibold'>
//               No Topics found
//             </p>
//           </div>
//         )}
//         <div ref={ref} className='h-10'></div>
//       </div>

//       {isLoading || isFetchingNextPage ? (
//         <div className='flex justify-center items-center my-4'>
//           <GlobalLoader />
//         </div>
//       ) : (
//         <div></div>
//       )}
//     </>
//   );
// }
"use client";

import { TopicsCard } from "@/components/community/topics-card";
import GlobalLoader from "@/components/globalloader";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalFeedStore } from "@/stores/GlobalFeedStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function Community() {
  const user = useGlobalAuthStore((state) => state.user);
  const updateActiveSubTopic = useGlobalFeedStore(
    (state) => state.setActiveSubTopic
  );
  const updateActiveLayout = useGlobalLayoutStore(
    (state) => state.setActiveLayout
  );

  useEffect(() => {
    updateActiveSubTopic("");
    updateActiveLayout("post");
  }, []);

  const limit = 5;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["community", user?.id],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await _axios.get(
          `/community?page=${pageParam}&limit=${limit}&userId=${user?.id}`
        );
        return res?.data; // Ensure to return only data
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.topics?.length === limit ? nextPage : undefined;
      },
    });

  const hasTopics = !isLoading && data?.pages?.[0]?.topics?.length > 0;

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
      <div className='mx-2 md:mx-12 mt-6'>
        {isLoading ? (
          <div className='flex flex-col gap-4 w-full'>
            {[...Array(2)].map((_, i) => (
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
        ) : hasTopics ? (
          data?.pages?.flatMap((page, pageIndex) =>
            page?.topics?.map((topic: any) => {
              return (
                <div key={`${pageIndex}-${topic._id}`}>
                  <h1 className='my-4 font-bold text-2xl'>{topic.topicName}</h1>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                    {topic.subTopic.map(
                      (subTopic: any, subTopicIndex: number) => (
                        <TopicsCard
                          key={subTopicIndex}
                          subTopicName={subTopic.subTopicName}
                          description={subTopic.description}
                          subTopicId={subTopic._id}
                          joined={subTopic.joined}
                          slug={subTopic.slug}
                          groupCount={subTopic.groupCount}
                          totalEvents={subTopic.totalEvents}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div className='flex flex-col justify-center items-center gap-4'>
            <p className='text-gray-500 text-xs font-semibold'>
              No Topics found
            </p>
          </div>
        )}
        <div ref={ref} className='h-10'></div>
      </div>

      {isLoading || isFetchingNextPage ? (
        <div className='flex justify-center items-center my-4'>
          <GlobalLoader />
        </div>
      ) : null}
    </>
  );
}
