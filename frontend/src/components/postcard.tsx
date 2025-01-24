import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function Postcard() {
  return (
    <div className="mt-4 shadow-none border-none px-2 mb-8 w-full">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="/assets/person.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="self-end">
            <h3 className="text-textcol font-semibold text-sm">Wilson Raj</h3>
            <p className="text-[#043A53] text-xs font-medium">300+ Members</p>
          </div>

          {/* <p className="text-[#828485] text-xs font-medium self-end">
            Created 3 months ago
          </p> */}
        </div>

        <p className="text-xs font-medium text-[#6B6D6D] self-end">
          10 hrs ago
        </p>
      </div>

      <div className="mt-3">
        <h2 className="text-lg text-textcol font-semibold">
          NYC Tri-state Asian Outdoors, Food, Travel & Random Events
        </h2>
        <p className="font-normal mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cil
        </p>

        <img
          src="/assets/post-placeholder.jpeg"
          className="mt-2"
          alt="Persons walking"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-6 justify-between">
          <div className="flex gap-1 items-center font-semibold">
            <img className="h-5 w-5" src="/assets/heart.svg" alt="" />
            <p>325</p>
          </div>
          <div className="flex gap-1 items-center font-semibold">
            <img className="h-5 w-5" src="/assets/message.svg" alt="" />
            <p>325</p>
          </div>
          <div className="flex gap-1 items-center font-semibold">
            <img className="h-5 w-5" src="/assets/share.svg" alt="" />
            <p>325</p>
          </div>
        </div>

        <p className="text-[#043A53]">View all replies</p>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {/* <Textarea /> */}
        <p className="text-[#828485]">Write your comment</p>
      </div>
    </div>
  );
}
