import { ChatContact } from "./chat-contacts";

export function ChatBase() {
  return (
    <div className="min-h-[calc(100vh-350px)] flex flex-col  p-4 h-[calc(100vh-450px)] overflow-y-auto hide-scrollbar rounded-xl">
      <ChatContact />
    </div>
  );
}
