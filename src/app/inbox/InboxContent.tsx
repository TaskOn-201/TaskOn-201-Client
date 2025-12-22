"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import InboxSidebar from "./InboxSidebar";
import MessageDetail from "./MessageDetail";
import PageHeader from "@/components/PageHeader";
import { useChatRooms } from "@/lib/chat/hooks/useChatRooms";
import { useAuthStore } from "@/store/useAuthStore";
import { Client } from "@stomp/stompjs";
import { createStompClient } from "@/lib/chat/stompClient";
import { useChatMessageHistory } from "@/lib/chat/hooks/useChatMessageHistory";
import { useChatMessageUpdates } from "@/lib/chat/hooks/useChatMessageUpdates";
import { useQueryClient } from "@tanstack/react-query";
import { ChatRoomData } from "./type";
import useMe from "@/lib/user/useMe";
import { useChatErrors } from "@/lib/chat/hooks/useChatErrors";
import SearchChatUsersModal from "@/components/chat/SearchChatUsersModal";
import { sendChatMessage } from "@/lib/chat/stompSendChat";

export default function InboxContent() {
    const accessToken = useAuthStore((s) => s.accessToken);
    const [replyContent, setReplyContent] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [connected, setConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const [isSearchUserChatModalOpen, setIsSearchUserChatModalOpen] =
        useState(false);

    // 방 목록 조회
    const {
        data: rooms = [],
        isLoading: isRoomLoading,
        isError,
    } = useChatRooms();

    // stomp 연결
    useEffect(() => {
        if (!accessToken) return;

        const stompClient = createStompClient({
            accessToken,
            onConnect: () => {
                setConnected(true);
            },
            onDisconnect: () => {
                setConnected(false);
            },
            onStompError: (frame) => {
                console.log("❌ STOMP ERROR", frame.headers, frame.body);
            },
        });

        clientRef.current = stompClient;
        stompClient.activate();

        return () => {
            setConnected(false);
            stompClient.deactivate();
            clientRef.current = null;
        };
    }, [accessToken]);

    const clickLockRef = useRef(false);

    // 중복 클릭 방지
    const handleRoomClick = useCallback((roomId: number) => {
        if (clickLockRef.current) return;

        clickLockRef.current = true;
        setSelectedRoomId((prev) => (prev === roomId ? prev : roomId));

        window.setTimeout(() => {
            clickLockRef.current = false;
        }, 150);
    }, []);

    // 에러 구독
    useChatErrors(clientRef, connected);

    // 업데이트 구독
    // useChatRoomUpdates(clientRef, connected, selectedRoomId);

    const { isSubscribed } = useChatMessageUpdates(
        clientRef,
        selectedRoomId,
        connected,
        me?.userId
    );

    const selectedRoom = useMemo(
        () => rooms.find((r) => r.chatRoomId === selectedRoomId) ?? null,
        [rooms, selectedRoomId]
    );

    // 메세지 리스트(히스토리) 가져오기
    const { data: messages = [], isLoading: isMessageLoading } =
        useChatMessageHistory(selectedRoomId);

    // 메세지 전송
    const handleSendReply = () => {
        if (!selectedRoomId) return;
        if (!replyContent.trim()) return;

        const client = clientRef.current;
        if (!client || !client.connected) return;

        if (!isSubscribed()) return;

        sendChatMessage(clientRef, selectedRoomId, replyContent);
        setReplyContent("");

        queryClient.setQueryData<ChatRoomData[]>(["chatRooms"], (prev) => {
            if (!prev) return prev;

            const nowLabel = "방금 전";
            const now = new Date().toISOString();

            const next = prev.map((room) =>
                room.chatRoomId === selectedRoomId
                    ? {
                          ...room,
                          lastMessage: replyContent,
                          lastMessageTime: nowLabel,
                          unreadCount: 0,
                          lastMessageAt: now,
                      }
                    : room
            );

            // 최신 메시지 방이 위로 올라오게
            const idx = next.findIndex((r) => r.chatRoomId === selectedRoomId);
            if (idx > 0) {
                const [picked] = next.splice(idx, 1);
                next.unshift(picked);
            }

            return next;
        });
    };

    if (isRoomLoading) return <div className="p-6">불러오는 중...</div>;
    if (isError) return <div className="p-6">채팅방 목록 조회 실패</div>;

    return (
        <div className="h-screen overflow-hidden flex flex-col bg-white">
            <PageHeader
                left="Inbox"
                className="shrink-0 px-6 py-6 border-b border-gray2"
                right={
                    <Button
                        label="+ 개인 채팅방"
                        variant="primary"
                        size="sm"
                        className="px-4 py-2 rounded-2xl"
                        onClick={() => setIsSearchUserChatModalOpen(true)}
                    />
                }
            />
            <SearchChatUsersModal
                isOpen={isSearchUserChatModalOpen}
                onClose={() => setIsSearchUserChatModalOpen(false)}
                onCreated={(chatRoomId) => setSelectedRoomId(chatRoomId)}
                rooms={rooms}
                myUserId={me?.userId}
            />
            <div className="flex-1 flex min-h-0">
                <InboxSidebar
                    rooms={rooms}
                    selectedRoomId={selectedRoomId}
                    onRoomClick={(room) => handleRoomClick(room.chatRoomId)}
                    myUserId={me?.userId}
                />

                {selectedRoom ? (
                    <MessageDetail
                        room={selectedRoom}
                        messages={messages}
                        isLoading={isMessageLoading}
                        replyText={replyContent}
                        onReplyChange={setReplyContent}
                        onSendContent={handleSendReply}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray4 gap-2">
                        <p className="text-sm text-gray4">
                            왼쪽에서 대화를 시작할 채팅방을 선택해주세요!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
