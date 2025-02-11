import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
export function TopicsSidebar() {
  return (
    <main className='px-5'>
      <div className='flex gap-3 items-center'>
        {/* <Icon className='text-xl' icon='octicon:chevron-right-12' /> */}
        <h1 className='my-4 font-bold text-2xl'>Filter</h1>
      </div>
      <div className=''>
        <div className='relative flex items-center'>
          <Search className='w-4 h-4 absolute left-3' />
          <Input
            className='pl-10 w-full h-[35px] border-[#E2E2E2] bg-contrastbg'
            placeholder='Search Community'
            name='search'
            id='search'
          />
        </div>
      </div>
      <aside className='pt-5'>
        <Collapsible>
          <CollapsibleTrigger className='w-full'>
            <div className='flex  justify-between items-center'>
              <h1 className='text-contrasttext font-semibold text-sm md:text-lg'>
                Technology & Science
              </h1>
              <Icon className='text-xl' icon='octicon:chevron-down-12' />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div>
              <p>hello</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </aside>
    </main>
  );
}
