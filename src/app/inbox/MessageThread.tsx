import { ChatMessage } from "./type";
import useMe from "@/lib/user/useMe";
import Profile from "@/components/Profile";
import { formatChatRoomTime } from "@/lib/chat/chatUtils";

interface MessageThreadProps {
    messages: ChatMessage[];
}

const MessageThread = ({ messages }: MessageThreadProps) => {
    const { data: me } = useMe();

    return (
        <div className="flex flex-col min-h-full justify-end">
            {messages.map((msg) => {
                const isMe = msg.sender?.userId === me?.userId;
                const displayName = msg.sender?.name ?? "탈퇴한 사용자";
                const initial = displayName.charAt(0);

                return (
                    <div
                        key={msg.messageId}
                        className={`flex mb-4 ${
                            isMe ? "justify-end" : "justify-start"
                        }`}
                    >
                        {/* 상대방 */}
                        {!isMe && (
                            <div className="flex items-start gap-2 max-w-[70%]">
                                <Profile
                                    className="w-8 h-8 shrink-0 text-sm"
                                    userName={initial}
                                    imageUrl={msg.sender?.profileImageUrl}
                                />

                                <div className="flex flex-col items-start">
                                    <span className="mb-1 text-sm text-gray5">
                                        {displayName}
                                    </span>

                                    <div className="bg-gray1/30 py-2.5 px-4 rounded-2xl">
                                        <p className="text-sm text-gray5 whitespace-pre-wrap wrap-break-words">
                                            {msg.content}
                                        </p>
                                    </div>

                                    <span className="mt-1 ml-2 text-[11px] text-gray3">
                                        {formatChatRoomTime(msg.displayTime)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 나 */}
                        {isMe && (
                            <div className="flex flex-col items-end max-w-[70%]">
                                {/* 말풍선(내용만) */}
                                <div className="bg-main/10 py-2.5 px-4 rounded-2xl">
                                    <p className="text-sm text-gray5 whitespace-pre-wrap wrap-break-words">
                                        {msg.content}
                                    </p>
                                </div>
                                <span className="mt-1 text-[11px] text-gray3">
                                    {formatChatRoomTime(msg.displayTime)}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MessageThread;
