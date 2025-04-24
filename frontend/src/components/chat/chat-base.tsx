import { ChatContact } from "./chat-contacts";

export function ChatBase() {
  return (
    <div className='bxl:min-h-[calc(100vh-350px)]  p-4   bxl:h-[calc(100vh-450px)] overflow-y-auto hide-scrollbar rounded-xl'>
      <ChatContact />
    </div>
  );
}
