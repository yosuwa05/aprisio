import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ShareGroups } from "./sharegroups";
import { ShareUsers } from "./shareusers";
import { useDebouncedValue } from "@mantine/hooks";

type Props = {
  postId: string;
  CloseDialog: () => void;
};

export function PostShareModalWeb({ postId, CloseDialog }: Props) {
  const tabs = ["Groups", "Users"];
  const [activeTab, setActiveTab] = useState("Groups");
  const [groupSearch, setGroupSearch] = useState<string>("");
  const [debouncedGroupSearch] = useDebouncedValue(groupSearch, 400);
  return (
    <main>
      <div className='flex items-center justify-between '>
        <div className='flex'>
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex cursor-pointer text-lg mx-4 ${
                activeTab === tab
                  ? "text-contrasttext font-bold"
                  : "text-fadedtext"
              }`}>
              <h3>{tab}</h3>
            </div>
          ))}
        </div>

        <div className='relative flex items-center'>
          <Search className='w-4 h-4 absolute left-3' />
          <Input
            className='pl-10 border-[#E2E2E2] bg-contrastbg'
            placeholder={`Search ${activeTab}`}
            name='search'
            id='search'
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='p-5 h-[50vh] overflow-y-scroll hide-scrollbar'>
        {activeTab === "Groups" ? (
          <ShareGroups
            searchKey={debouncedGroupSearch}
            postId={postId ?? ""}
            CloseDialog={CloseDialog}
          />
        ) : (
          <ShareUsers searchKey={debouncedGroupSearch} postId={postId ?? ""} />
        )}
      </div>
    </main>
  );
}
