"use client";

import { MyProfileTopBar } from "@/components/my-profile/my-profile-top-bar";
import Topbar from "@/components/shared/topbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { _axios } from "@/lib/axios-instance";
import { BASE_URL } from "@/lib/config";
import { makeUserAvatarSlug } from "@/lib/utils";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChatBase } from "@/components/chat/chat-base";
import { EditProfile } from "@/components/my-profile/my-profile-edit";
import { MyProfileCreatedGroups } from "@/components/my-profile/tabsection/my-profile-created-groups";
import { MyProfileLikedPosts } from "@/components/my-profile/tabsection/my-profile-favourite-posts";
import { MyProfileJoinedGroups } from "@/components/my-profile/tabsection/my-profile-joined-groups";
import { MyProfileOrganisedEvents } from "@/components/my-profile/tabsection/my-profile-orgainsed-events";
import { MyProfileParticipatedEvents } from "@/components/my-profile/tabsection/my-profile-participated-events";
import { MyProfileCommentedPosts } from "@/components/my-profile/tabsection/myprofile-commented-posts";
import { MyProfileCreatedPosts } from "@/components/my-profile/tabsection/myprofile-created-posts";
import { useGlobalLayoutStore } from "@/stores/GlobalLayoutStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function MyProfile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useGlobalAuthStore((state) => state.user);
  const [chatOpen, isChatOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

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
  const activeTab = useGlobalLayoutStore((state) => state.activeMyProfileTab);

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
      <div className='bg-white h-screen w-screen flex justify-center items-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className=''>
      <div className='sticky top-[2px] z-50 bg-white py-2'>
        <Topbar />
        <MyProfileTopBar />
      </div>

      <div className='mt-2   container flex flex-wrap  mx-auto'>
        <div className='lg:max-w-[350px] w-full'>
          <div className='flex flex-col gap-4'>
            <div className=' shadow-xl rounded-xl p-4'>
              <div className='h-[150px] bg-[#F5F5F5] flex flex-col items-center justify-center relative'>
                <div className='absolute -bottom-10 flex flex-col items-center'>
                  <div className='p-2 bg-white rounded-2xl shadow border-none'>
                    <Avatar className='w-32 h-32 font-bold text-3xl text-white cursor-pointer  rounded-md'>
                      <AvatarImage
                        className='object-cover w-full h-full'
                        src={BASE_URL + `/file?key=${user?.image}`}
                      />
                      <AvatarFallback className=''>
                        {makeUserAvatarSlug(data?.user.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className='mt-12 flex flex-col gap-3 items-center border-b pb-4'>
                <h1 className='font-semibold text-3xl text-textcol capitalize text-center'>
                  {data?.user?.name}
                </h1>
                <div className='flex gap-2 items-center text-sm text-fadedtext'>
                  <Icon icon='ic:outline-email' />
                  <p>{data?.user?.email}</p>
                </div>

                <Button
                  onClick={() => setActiveTab("edit-profile")}
                  className={`rounded-3xl border-[0.2px]   text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}>
                  Edit Profile
                </Button>
              </div>

              <div className='border-b pb-4'>
                <div className='pt-2 grid gap-2  grid-cols-2'>
                  <div
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'
                    onClick={() => setActiveTab("created-posts")}>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.totalPostsCreated}
                    </h1>
                    <p className='text-sm text-fadedtext'>Total Threads</p>
                  </div>
                  <div
                    onClick={() => setActiveTab("commented-posts")}
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.postsCommented}
                    </h1>
                    <p className='text-sm text-fadedtext'>Post Comments</p>
                  </div>
                  <div
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'
                    onClick={() => setActiveTab("organised-events")}>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.eventsOrganized}
                    </h1>
                    <p className='text-sm text-fadedtext'>Events Organized</p>
                  </div>
                  <div
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'
                    onClick={() => setActiveTab("participated-events")}>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.eventsParticipated}
                    </h1>
                    <p className='text-sm text-fadedtext'>Event Participated</p>
                  </div>
                  <div
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'
                    onClick={() => setActiveTab("created-groups")}>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.groupsCreated}
                    </h1>
                    <p className='text-sm text-fadedtext'>Group Created</p>
                  </div>
                  <div
                    className='flex flex-col gap-3 justify-center cursor-pointer hover:bg-muted rounded-lg p-2'
                    onClick={() => setActiveTab("joined-groups")}>
                    <h1 className='text-2xl text-contrasttext font-semibold'>
                      {data?.groupParticipated}
                    </h1>
                    <p className='text-sm text-fadedtext'>Group Participated</p>
                  </div>
                </div>
              </div>

              <div className='pb-4'>
                <h1 className='text-xl py-2  text-contrasttext/50'>Account</h1>
                <div className='flex flex-wrap gap-3'>
                  <Button
                    className={`rounded-3xl border-[0.2px] text-black transition-all duration-500 bg-[#F2F5F6] border-[#043A53] hover:bg-[#FCF7EA] hover:border-[#AF9654]`}
                    onClick={() => setLogoutOpen(true)}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-120px)] hide-scrollbar overflow-hidden lg:min-w-[600px] w-full lg:pt-0 pt-5'>
          {activeTab == "commented-posts" && <MyProfileCommentedPosts />}
          {activeTab == "created-posts" && <MyProfileCreatedPosts />}
          {activeTab == "favourite-posts" && <MyProfileLikedPosts />}
          {activeTab == "organised-events" && <MyProfileOrganisedEvents />}
          {activeTab == "participated-events" && (
            <MyProfileParticipatedEvents />
          )}
          {activeTab == "created-groups" && <MyProfileCreatedGroups />}
          {activeTab == "joined-groups" && <MyProfileJoinedGroups />}
          {activeTab == "edit-profile" && <EditProfile />}
        </div>
        <div
          className='hidden bxl:block lg:max-w-[350px] rounded-lg h-fit mt-4 mr-2'
          style={{
            boxShadow: "0px 0px 10px -1px rgba(2, 80, 124, 0.25)",
          }}>
          <div className='bg-white rounded-xl w-[350px]'>
            <ChatBase />
          </div>
        </div>
      </div>
      <div
        onClick={() => isChatOpen(true)}
        className='fixed bottom-10 right-10 z-[60] block  bxl:hidden'>
        {/* <Button className='bg-white   duration-500 border-2 border-blue-600 fixed  w-12 transform hover:-translate-y-3   h-12 text-2xl rounded-full hover:bg-blue-600 hover:text-white text-blue-600 '>
          <Icon icon={"hugeicons:bubble-chat"} />
        </Button> */}
        <Button className='bg-white border-2 border-blue-600 w-12 h-12 text-2xl rounded-full hover:-translate-y-3  hover:bg-blue-600 hover:text-white text-blue-600 transition-all duration-500'>
          <Icon icon={"hugeicons:bubble-chat"} />
        </Button>
      </div>
      <Dialog open={chatOpen} onOpenChange={isChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ChatBase />
        </DialogContent>
      </Dialog>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className='max-w-sm w-full p-6'>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={logout}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
