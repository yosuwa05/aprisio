import { Button } from "../ui/button";

interface Props {
  subTopicName: string;
  description: string;
}

export function TopicsCard({ subTopicName, description }: Props) {
  return (
    <div className="w-[350px] border-[1px] border-[#C0C0C0] rounded-xl p-4 cursor-pointer">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold capitalize">{subTopicName}</h2>

          <div className="flex gap-2">
            <p>300+ Groups</p>

            <p>200+ Events</p>
          </div>
        </div>

        <Button className="bg-[#FCF7EA] text-black rounded-3xl hover:bg-[#FCF7EA]">
          Join
        </Button>
      </div>

      <p className="text-xs text-[#828485] mt-2 font-normal leading-4">
        {description}
      </p>
    </div>
  );
}
