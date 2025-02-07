import { Button } from "../ui/button";

export function TopicsCard() {
  return (
    <div className="w-[350px] border-[1px] border-[#C0C0C0] rounded-xl p-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Technology</h2>

          <div className="flex gap-2">
            <p>300+ Groups</p>

            <p>200+ Events</p>
          </div>
        </div>

        <Button className="bg-[#FCF7EA] text-black rounded-3xl">Join</Button>
      </div>

      <p className="text-xs text-[#828485] mt-2 font-normal leading-4">
        Join a vibrant community of retired like-minded individuals exploring
        new interests, meaningful connections,..
      </p>
    </div>
  );
}
