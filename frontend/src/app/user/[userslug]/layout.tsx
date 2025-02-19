"use client";

import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileimage from "@img/assets/person.png";
import chevronleft from "@img/icons/chevron-left.svg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PersonalProfile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userslug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userslug],
    queryFn: async () => {
      const res = _axios
        .get(`/user/getprofilebyname?slug=${userslug}`)
        .then((res) => res.data);
      return res;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="">
      <div className="sticky top-[2px] z-50 bg-white py-2">
        <Topbar />
        <ProfileTopBar />
      </div>

      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:max-w-[300px] min-w-[300px]">
          <div className="flex flex-col gap-4">
            <div className="h-[380px] shadow-xl rounded-xl p-4">
              <div className="h-[150px] bg-[#F5F5F5] flex flex-col items-center justify-center relative">
                <div className="absolute -bottom-10 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-2xl shadow border-none">
                    <Image
                      src={profileimage}
                      className="rounded-2xl bg-white"
                      width={90}
                      height={90}
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-3 items-center">
                <h1 className="font-semibold text-3xl text-textcol capitalize">
                  {data?.user.name}
                </h1>
                <div className="flex gap-2 items-center text-sm text-fadedtext">
                  <Icon icon="ic:outline-email" />
                  <p>{data?.user.email}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-10 items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl text-contrasttext">
                    {data?.groupsCount}
                  </h2>
                  <p>Groups</p>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl text-contrasttext">
                    {data?.subtopicsFollowed}
                  </h2>
                  <p>Topics</p>
                </div>
              </div>
            </div>

            <h1 className="text-[#043A537D] text-2xl px-2 my-4">
              Topics {userslug} Follow
            </h1>

            <div className="flex flex-col gap-3">
              <div>
                <Button className="bg-[#F6F5F2] rounded-2xl text-contrasttext font-bold text-lg p-5 hover:bg-[#F6F5F2]">
                  Career & Business
                  <Image src={chevronleft} height={20} width={20} alt="arrow" />
                </Button>
              </div>
              <div>
                <Button className="bg-[#F6F5F2] rounded-2xl text-contrasttext font-bold text-lg p-5 hover:bg-[#F6F5F2]">
                  Yoga
                  <Image src={chevronleft} height={20} width={20} alt="arrow" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
