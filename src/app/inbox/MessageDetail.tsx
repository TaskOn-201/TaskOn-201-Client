import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/Button";
import { Message, ThreadMessage } from "./type";
import MessageThread from "./MessageThread";

interface MessageDetailProps {
  message: Message;
  replyText: string;
  onReplyChange: (text: string) => void;
  onSendReply: () => void;
}

const MessageDetail = ({
  message,
  replyText,
  onReplyChange,
  onSendReply,
}: MessageDetailProps) => {
  // 예시 채팅 데이터 - 참여자들의 메시지
  const threadMessages: ThreadMessage[] = [
    {
      id: 1,
      sender: message.participants[0]?.name || message.sender,
      avatar: message.participants[0]?.avatar || message.avatar,
      content: "ㅎㅇㅇ",
      time: "5 minutes ago",
      isCurrentUser: false,
    },
    {
      id: 2,
      sender: message.participants[1]?.name || "User",
      avatar: message.participants[1]?.avatar || "U",
      content: "ㅎㅇ",
      time: "2 minutes ago",
      isCurrentUser: false,
    },
  ];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendReply();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 메시지 헤더 */}
      <div className="px-4 py-[19px] border-b border-gray-200 flex items-center gap-3">
        <p className="text-xs text-gray4">Collaborators:</p>
        <div className="flex">
          {message.participants.map((participant) => (
            <Avatar
              key={participant.id}
              className="w-8 h-8 shrink-0 border-2 border-white"
            >
              <AvatarFallback className="bg-gray-200 text-main2 font-medium text-xs">
                {participant.avatar}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* 이전 메시지들 */}
        <MessageThread messages={threadMessages} />
      </div>

      {/* 답장 입력 영역 */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={replyText}
            onChange={(e) => onReplyChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          />
          <Button
            onClick={onSendReply}
            variant="primary"
            size="md"
            label="Send"
            icon={<Send className="w-4 h-4" />}
            className="px-6"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
