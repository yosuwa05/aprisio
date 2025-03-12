"use client";

import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useChatStore } from "@/stores/ChatStore";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import chevronleft from "@img/icons/chevron-left.svg";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function PersonalProfile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userslug } = useParams();
  const user = useGlobalAuthStore((state) => state.user);
  const router = useRouter();

  const updateChat = useChatStore((state) => state.setSelectedChat);

  const { data, isLoading } = useQuery({
    queryKey: ["user", userslug],
    queryFn: async () => {
      const res = _axios
        .get(`/user/getprofilebyname?slug=${userslug}`)
        .then((res) => res.data);
      return res;
    },
  });

  const userName = useMemo(() => {
    if (userslug) {
      return decodeURIComponent(userslug.toString());
    }
    return "";
  }, [userslug]);

  if (isLoading) {
    return (
      <div className='bg-white h-screen w-screen flex justify-center items-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className=''>
      <div className='sticky top-[2px] z-50 bg-white py-2'>
        <Topbar />
        <ProfileTopBar />
      </div>

      <div className='mt-4 flex flex-col lg:flex-row gap-8  max-w-[1200px] mx-auto'>
        <div className='lg:max-w-[300px] min-w-[300px]'>
          <div className='flex flex-col gap-4'>
            <div className='h-[420px] shadow-xl rounded-xl p-4'>
              <div className='h-[150px] bg-[#F5F5F5] flex flex-col items-center justify-center relative'>
                <div className='absolute -bottom-10 flex flex-col items-center'>
                  <div className='p-2 bg-white rounded-2xl shadow border-none'>
                    <Avatar className='w-32 h-32 font-bold text-3xl text-white cursor-pointer  rounded-md'>
                      <AvatarImage
                        className='object-cover w-full h-full'
                        src={BASE_URL + `/file?key=${data?.user?.image}`}
                      />
                      <AvatarFallback className=''>
                        {makeUserAvatarSlug(data?.user.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className='mt-12 flex flex-col gap-3 items-center'>
                <h1 className='font-semibold text-xl  md:text-2xl text-textcol capitalize text-center text-wrap whitespace-pre-wrap overflow-hidden overflow-ellipsis max-w-[250px]'>
                  {data?.user?.name}
                </h1>
                {user && (
                  <>
                    <div className='flex gap-2 items-center text-sm text-fadedtext'>
                      <Icon icon='ic:outline-email' />
                      <p>{data?.user.email}</p>
                    </div>
                    <div className='flex gap-2 items-center text-sm text-fadedtext'>
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className='text-sm bg-gray-300 hover:bg-gray-300'
                        onClick={() => {
                          router.push("/profile");
                          updateChat({
                            name: data?.user?.name,
                            userId: data?.user._id,
                            selected: true,
                          });
                        }}>
                        <MessageCircle size={32} />
                        Chat
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className='mt-4 flex gap-10 items-center justify-center'>
                <div className='text-center'>
                  <h2 className='text-3xl text-contrasttext'>
                    {data?.groupsCount}
                  </h2>
                  <p>Groups</p>
                </div>

                <div className='text-center'>
                  <h2 className='text-3xl text-contrasttext'>
                    {data?.subtopicsFollowed}
                  </h2>
                  <p>Topics</p>
                </div>
              </div>
            </div>

            <h1 className='text-[#043A537D] text-2xl px-2 my-4'>
              Topics {userName} Follow
            </h1>

            <div className='flex flex-col gap-3'>
              {data?.followedByUser &&
                data?.followedByUser.map((topic: any, index: number) => (
                  <div key={index}>
                    <Button
                      onClick={() => {
                        router.push(`/feed/explore/${topic?.subTopicId?.slug}`);
                      }}
                      className='bg-[#F6F5F2] flex flex-start rounded-2xl text-contrasttext font-bold text-lg p-5 hover:bg-[#F6F5F2]'>
                      {topic?.subTopicId?.subTopicName}
                      <Image
                        src={chevronleft}
                        height={20}
                        width={20}
                        alt='arrow'
                      />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
