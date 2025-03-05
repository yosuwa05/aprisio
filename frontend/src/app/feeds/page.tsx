"use client";

import { TopCommunityBar } from "@/components/community/top-community-bar";
import PersonalFeed from "@/components/pages/personalfeed";
import Topbar from "@/components/shared/topbar";
import { ToastContainer } from "react-toastify";

export default function Feeds() {

  return (
    <>
              <>
      <div className="sticky top-[-2px] z-50 bg-white py-2">
        <Topbar />
       <TopCommunityBar />
      </div>
      <ToastContainer />

        <PersonalFeed />

    </>
    </>
  );
}
