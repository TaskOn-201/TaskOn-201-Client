import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { RefObject, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@/app/inbox/type";
import { findSender } from "../chatUtils";

export function useChatMessageUpdates(
    clientRef: RefObject<Client | null>,
    chatRoomId: number | null,
    connected: boolean,
    myUserId: number | undefined
) {
    const queryClient = useQueryClient();

    // subscription은 ref로 관리
    const subscriptionRef = useRef<StompSubscription | null>(null);

    const lastSyncRef = useRef(0);

    useEffect(() => {
        const client = clientRef.current;
        if (!client || !connected || !chatRoomId) return;

        // 기존 구독 해제
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        // 새 방 subscribe
        subscriptionRef.current = client.subscribe(
            `/topic/chat/rooms/${chatRoomId}`,
            (msg: IMessage) => {
                const raw = JSON.parse(msg.body);

                // 메세지 리스트 업데이트
                queryClient.setQueryData<ChatMessage[]>(
                    ["chatMessages", chatRoomId],
                    (prev) => {
                        // sender 가 Id 값만 와서 sender 정보 찾기
                        const sender = findSender(prev, raw.senderId) ?? {
                            userId: raw.senderId,
                            name: "",
                            profileImageUrl: null,
                        };

                        const incoming: ChatMessage = {
                            messageId: raw.messageId,
                            chatRoomId: raw.chatRoomId,
                            sender,
                            content: raw.content,
                            sentTime: raw.sentTime,
                            displayTime: raw.displayTime,
                        };

                        if (!prev) return [incoming];
                        if (
                            prev.some((m) => m.messageId === incoming.messageId)
                        )
                            return prev;

                        return [...prev, incoming];
                    }
                );

                // 현재 방에서 내가 있으면 읽음 처리 -> 있던 방에서 나가면 메세지 읽음 처리 안되는 현상 방지
                if (myUserId && raw.senderId !== myUserId) {
                    const now = Date.now();
                    if (now - lastSyncRef.current > 800) {
                        // 0.8초에 1번만
                        lastSyncRef.current = now;

                        queryClient.invalidateQueries({
                            queryKey: ["chatMessages", chatRoomId],
                        });
                    }
                }
            }
        );

        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
        };
    }, [clientRef, connected, chatRoomId, queryClient, myUserId]);

    const isSubscribed = () => !!subscriptionRef.current;

    return { isSubscribed };
}
