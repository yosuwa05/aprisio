"use client";

import { MyProfileTopBar } from "@/components/my-profile/my-profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileimage from "@img/assets/person.png";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function MyProfile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useGlobalAuthStore((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["user personal"],
    queryFn: async () => {
      const res = _axios.get(`/personal/auth/profile`).then((res) => res.data);
      return res;
    },
  });

  if (isLoading || !user) {
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
        <MyProfileTopBar />
      </div>

      <div className="mx-2 md:mx-8 mt-2 flex flex-col lg:flex-row gap-8 my-8 overflow-hidden">
        <div className="lg:max-w-[350px] min-w-[350px]">
          <div className="flex flex-col gap-4">
            <div className=" shadow-xl rounded-xl p-4">
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

              <div className="mt-12 flex flex-col gap-3 items-center border-b pb-4">
                <h1 className="font-semibold text-3xl text-textcol capitalize text-center">
                  {data?.user?.name}
                </h1>
                <div className="flex gap-2 items-center text-sm text-fadedtext">
                  <Icon icon="ic:outline-email" />
                  <p>{data?.user?.email}</p>
                </div>

                <Button
                  className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="border-b pb-4">
                <div className="pt-2 grid gap-6  grid-cols-2">
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">Total Threads</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">Post Comments</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">Events Organized</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">
                      Event Participated
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">Group Created</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      50
                    </h1>
                    <p className="text-base text-fadedtext">
                      Group Participated
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h1 className="text-xl py-2  text-contrasttext/50">Create</h1>
                <div className="flex gap-3">
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                  >
                    Event
                  </Button>
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                  >
                    Group
                  </Button>
                </div>
              </div>
              <div className="pb-4">
                <h1 className="text-xl py-2  text-contrasttext/50">Account</h1>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                  >
                    Logout
                  </Button>
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                  >
                    Delete Account
                  </Button>
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
