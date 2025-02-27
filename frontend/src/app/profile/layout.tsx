"use client";

import { MyProfileTopBar } from "@/components/my-profile/my-profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function MyProfile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useGlobalAuthStore((state) => state.user);
  const setActiveTab = useGlobalLayoutStore(
    (state) => state.setActiveMyProfileTab
  );
  const { data, isLoading } = useQuery({
    queryKey: ["user personal"],
    queryFn: async () => {
      const res = _axios.get(`/personal/auth/profile`).then((res) => res.data);
      return res;
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let res = await _axios.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      useGlobalAuthStore.getState().setUser(null);
      router.push("/login");
    },
  });

  function logout() {
    if (isPending) return;
    mutate();
  }

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

      <div className="mx-2 md:mx-8 mt-2 flex flex-col lg:flex-row gap-8">
        <div className="lg:max-w-[350px] min-w-[350px]">
          <div className="flex flex-col gap-4">
            <div className=" shadow-xl rounded-xl p-4">
              <div className="h-[150px] bg-[#F5F5F5] flex flex-col items-center justify-center relative">
                <div className="absolute -bottom-10 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-2xl shadow border-none">
                    <Avatar className="w-32 h-32 font-bold text-3xl text-white cursor-pointer  rounded-md">
                      <AvatarImage
                        className="object-cover w-full h-full"
                        src={BASE_URL + `/file?key=${user?.image}`}
                      />
                      <AvatarFallback className="">
                        {makeUserAvatarSlug(data?.user.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
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
                  onClick={() => setActiveTab("edit-profile")}
                  className={`rounded-3xl border-[0.2px]   text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="border-b pb-4">
                <div className="pt-2 grid gap-6  grid-cols-2">
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.totalPostsCreated}
                    </h1>
                    <p className="text-base text-fadedtext">Total Threads</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.postsCommented}
                    </h1>
                    <p className="text-base text-fadedtext">Post Comments</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.eventsOrganized}
                    </h1>
                    <p className="text-base text-fadedtext">Events Organized</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.eventsParticipated}
                    </h1>
                    <p className="text-base text-fadedtext">
                      Event Participated
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.groupsCreated}
                    </h1>
                    <p className="text-base text-fadedtext">Group Created</p>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-2xl text-contrasttext font-semibold">
                      {data?.groupParticipated}
                    </h1>
                    <p className="text-base text-fadedtext">
                      Group Participated
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="border-b pb-4">
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
              </div> */}
              <div className="pb-4">
                <h1 className="text-xl py-2  text-contrasttext/50">Account</h1>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                  {/* <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                  >
                    Delete Account
                  </Button> */}
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
