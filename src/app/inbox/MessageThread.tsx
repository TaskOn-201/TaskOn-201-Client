import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThreadMessage } from "./type";

interface MessageThreadProps {
  messages: ThreadMessage[];
}

const MessageThread = ({ messages }: MessageThreadProps) => {
  return (
    <div className="">
      {messages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-200 text-main2 text-xs font-medium">
              {msg.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-main2 text-sm">
                {msg.sender}
              </span>
              <span className="text-xs text-gray3">{msg.time}</span>
            </div>
            <p className="text-sm text-gray5">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
