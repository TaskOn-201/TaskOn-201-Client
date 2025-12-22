"use client";

import { Send } from "lucide-react";
import Button from "@/components/Button";
import { ChatMessage, ChatRoomData } from "./type";
import MessageThread from "./MessageThread";
import Profile from "@/components/Profile";
import useMe from "@/lib/user/useMe";
import { useEffect, useRef } from "react";

interface MessageDetailProps {
    room: ChatRoomData;
    messages: ChatMessage[];
    isLoading?: boolean;
    replyText: string;
    onReplyChange: (content: string) => void;
    onSendContent: () => void;
}

const MessageDetail = ({
    room,
    messages,
    isLoading,
    replyText,
    onReplyChange,
    onSendContent,
}: MessageDetailProps) => {
    const { data: me } = useMe();
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const res = scrollRef.current;
        if (!res) return;
        res.scrollTop = res.scrollHeight;
    }, [messages.length]);

    const sortedMessages = [...messages].sort(
        (a, b) => a.messageId - b.messageId
    );

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSendContent();
        }
    };

    if (isLoading) return <div className="p-2 text-sm text-gray5">메세지 불러오는 중...</div>;

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* 메시지 헤더 */}
            <div className="shrink-0 px-4 py-[19px] border-b border-gray-200 flex items-center gap-3">
                <p className="text-xs text-gray4">Collaborators:</p>
                <div className="flex gap-1">
                    {me && (
                        <Profile
                            key={me.userId}
                            imageUrl={me.profileImageUrl ?? undefined}
                            size="sm"
                            className="text-sm"
                            userName={me.name.charAt(0)}
                        />
                    )}
                    {/* 다른 참가자들 */}
                    {room.participants?.map((participant) => (
                        <Profile
                            key={participant.userId}
                            imageUrl={participant.profileImageUrl}
                            size="sm"
                            className="text-sm"
                            userName={participant.name.charAt(0)}
                        />
                    ))}
                </div>
            </div>

            {/* 메시지 내용 */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto min-h-0">
                {/* 이전 메시지들 */}
                <MessageThread messages={sortedMessages} />
            </div>

            {/* 답장 입력 영역 */}
            <div className="shrink-0 p-6 border-t border-gray-200">
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
                        onClick={onSendContent}
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
