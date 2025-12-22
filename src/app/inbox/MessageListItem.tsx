import { formatChatRoomTime } from "@/lib/chat/chatUtils";
import { ChatRoomData } from "./type";
import ChatRoomIcon from "./ChatRoomIcon";

interface MessageListItemProps {
    room: ChatRoomData;
    isSelected: boolean;
    onClick: () => void;
    myUserId: number | undefined;
}

const MessageListItem = ({
    room,
    isSelected,
    onClick,
    myUserId,
}: MessageListItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`p-8 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-gray-50" : ""
            }`}
        >
            <div className="flex items-start gap-3">
                <ChatRoomIcon room={room} myUserId={myUserId} />
                {/* 메시지 정보 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <span className="font-semibold text-main2 text-sm">
                                {room.roomName}
                            </span>{" "}
                            {room.chatType === "PERSONAL" && (
                                <span className="text-xs text-gray3">
                                    ( 1:1 채팅방 )
                                </span>
                            )}
                        </div>

                        <span className="text-xs text-gray3">
                            {formatChatRoomTime(room.lastMessageTime)}
                        </span>
                    </div>
                    <p className="text-xs text-gray4 truncate">
                        {room.lastMessage || "메시지가 없습니다."}
                    </p>
                </div>

                {/* 읽음 표시 */}
                {room.unreadCount > 0 && !isSelected && (
                    <span className="inline-flex justify-center items-center text-[11px] w-2 h-2 p-1 bg-sub2 rounded-full text-white" />
                )}
            </div>
        </div>
    );
};

export default MessageListItem;
