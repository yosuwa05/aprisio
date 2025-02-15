"use client";

import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { _axios } from "@/lib/axios-instance";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileimage from "@img/assets/person.png";
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
      <Topbar />
      <ProfileTopBar />

      <div className="mx-2 md:mx-8 mt-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:max-w-[300px] min-w-[300px]">
          <div className="h-[380px] shadow-xl rounded-md">
            <div className="h-[150px] bg-[#F5F5F5] border-1">
              <div className="mt-4 flex flex-col gap-3 items-center relative">
                <div className="h-[150px] bg-[#F5F5F5] flex self-center absolute"></div>

                <Image
                  src={profileimage}
                  className="rounded-xl mt-24"
                  width={70}
                  height={70}
                  alt=""
                />

                <h1 className="font-[600] text-3xl text-textcol capitalize">
                  {data?.user.name}
                </h1>

                <div className="flex gap-2 items-center">
                  <Icon icon="ic:outline-email"></Icon>
                  <p>{data?.user.email}</p>
                </div>
              </div>

              <div className="mt-4 flex  gap-7 items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl text-contrasttext">7.5 M</h2>
                  <p>Members</p>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl text-contrasttext">50</h2>
                  <p>Groups</p>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl text-contrasttext">200</h2>
                  <p>Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
