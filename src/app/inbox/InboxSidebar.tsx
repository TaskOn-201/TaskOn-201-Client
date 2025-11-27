import { Search, Pencil } from "lucide-react";
import Button from "@/components/Button";
import { Message } from "./type";
import MessageListItem from "./MessageListItem";

interface InboxSidebarProps {
  messages: Message[];
  selectedMessageId: number | null;
  onMessageClick: (message: Message) => void;
}

const InboxSidebar = ({
  messages,
  selectedMessageId,
  onMessageClick,
}: InboxSidebarProps) => {
  return (
    <div className="w-96 border-r border-gray-200 flex flex-col">
      {/* 검색 바 */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray3 w-4 h-4" />
          <input
            type="text"
            placeholder="Search message"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          />
        </div>
        <Button
          variant="white"
          size="sm"
          icon={<Pencil className="w-5 h-5" />}
          className="text-gray3 hover:text-main border border-gray-200"
        />
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageListItem
            key={message.id}
            message={message}
            isSelected={selectedMessageId === message.id}
            onClick={() => onMessageClick(message)}
          />
        ))}
      </div>
    </div>
  );
};

export default InboxSidebar;
