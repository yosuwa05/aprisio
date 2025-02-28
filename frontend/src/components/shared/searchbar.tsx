"use client";

import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";

export function SearchBar() {
  const pathname = usePathname();
  const unwantedRoutes = ["/join-community"];
  const [search, setSearch] = useState("");

  const router = useRouter();

  const [debouncedSubTopicSearch] = useDebouncedValue(search, 400);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", debouncedSubTopicSearch],
    queryFn: async () => {
      const res = await _axios.get(
        `/search?q=${debouncedSubTopicSearch}&limit=${5}&page=${1}`
      );
      return res.data;
    },
    enabled: !!debouncedSubTopicSearch,
  });

  return (
    <>
      {!unwantedRoutes.includes(pathname) && (
        <div className="hidden bxl:flex flex-col gap-2 items-center relative w-[400px]">
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            <Input
              className="pl-10 min-w-[400px] h-[35px] border-[#E2E2E2] bg-contrastbg"
              placeholder="Search Posts"
              name="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <X />
          </div>

          <AnimatePresence>
            {search && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-10"
              >
                {posts?.posts?.length > 0 ||
                (posts?.topics && posts.topics.length > 0) ? (
                  <>
                    {posts?.posts?.length > 0 && (
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-600 px-3">
                          Posts
                        </h3>
                        <div className="border-b border-gray-200 my-2"></div>
                        {posts.posts.map(
                          (
                            item: { title: string; slug: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm text-gray-900 font-medium"
                              onClick={() => {
                                setSearch("");
                                router.push("/feed/post/" + item.slug);
                              }}
                            >
                              {item.title}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {posts?.topics?.length > 0 && (
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-600 px-3">
                          Topics
                        </h3>
                        <div className="border-b border-gray-200 my-2"></div>
                        {posts.topics.map(
                          (
                            item: { subTopicName: string; slug: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSearch("");
                                router.push("/feed/explore/" + item.slug);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm text-gray-900 font-medium"
                            >
                              {item.subTopicName}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-3">
                    No search results found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!unwantedRoutes.includes(pathname) && (
        <Button className="border-[1px] bg-contrastbg bxl:hidden rounded-lg text-black border-[#E2E2E2] w-[25px] h-[35px] md:w-[35px] md:h-[35px]">
          <Search className="w-2 h-2" />
        </Button>
      )}
    </>
  );
}
