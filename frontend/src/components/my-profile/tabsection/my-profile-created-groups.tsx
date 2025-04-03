"use client";

import { useState } from "react";
import { MyProfileCreatedGroups } from "./my-profile-groups-tab";
import { MyProfileEventsApprove } from "./my-profile-event-approval-tab";

export const MyProfileGroupSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = ["Groups", "Requests"];

  return (
    <div className='p-1 lg:p-4'>
      <div className='flex items-center '>
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`cursor-pointer text-lg px-4 py-2 rounded-md transition-all duration-300 ease-linear ${
              index !== activeIndex
                ? "text-fadedtext"
                : "text-contrasttext font-bold "
            }`}>
            {tab}
          </div>
        ))}
      </div>
      <div className='pt-3'>
        {activeIndex === 0 && <MyProfileCreatedGroups />}
        {activeIndex === 1 && <MyProfileEventsApprove />}
      </div>
    </div>
  );
};
