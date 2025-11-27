import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "./type";

interface MessageListItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

const MessageListItem = ({
  message,
  isSelected,
  onClick,
}: MessageListItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-8 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-gray-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gray-200 text-main2 font-medium">
            {message.avatar}
          </AvatarFallback>
        </Avatar>

        {/* 메시지 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-main2 text-sm">
              {message.sender}
            </span>
            <span className="text-xs text-gray3">{message.time}</span>
          </div>
          <h3 className="text-sm font-medium text-main2 mb-1 truncate">
            {message.subject}
          </h3>
          <p className="text-xs text-gray4 truncate">{message.preview}</p>
        </div>

        {/* 읽지 않음 표시 */}
        {!message.isRead && (
          <div className="w-2 h-2 bg-sub2 rounded-full mt-1 shrink-0"></div>
        )}
      </div>
    </div>
  );
};

export default MessageListItem;
