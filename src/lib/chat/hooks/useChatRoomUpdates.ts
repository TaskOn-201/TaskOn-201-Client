import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { RefObject, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatRoomData } from "@/app/inbox/type";

type RoomListUpdatePayload = {
    chatRoomId: number;
    lastMessage: string;
    lastMessageTime: string;
    lastMessageAt?: string;
};

export function useChatRoomUpdates(
    clientRef: RefObject<Client | null>,
    connected: boolean,
    selectedRoomId: number | null
) {
    const queryClient = useQueryClient();

    const selectedRoomIdRef = useRef<number | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);

    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    // disconnected 되면 subscriptionRef를 반드시 비워서 다음 connect에서 재구독 가능하게
    useEffect(() => {
        if (connected) return;

        if (subscriptionRef.current) {
            try {
                subscriptionRef.current.unsubscribe();
            } catch {}
            subscriptionRef.current = null;
        }
    }, [connected]);

    useEffect(() => {
        const client = clientRef.current;
        if (!client || !connected || !selectedRoomId) return;

        if (subscriptionRef.current) return;

        console.log("🟢 SUBSCRIBE /user/queue/chat/rooms");

        subscriptionRef.current = client.subscribe(
            "/user/queue/chat/rooms",
            (msg: IMessage) => {
                const payload: RoomListUpdatePayload = JSON.parse(msg.body);
                console.log("🟡 ROOM-LIST EVENT", payload);

                queryClient.setQueryData<ChatRoomData[]>(
                    ["chatRooms"],
                    (prev) => {
                        if (!prev) return prev;

                        const idx = prev.findIndex(
                            (r) => r.chatRoomId === payload.chatRoomId
                        );

                        if (idx === -1) {
                            queryClient.invalidateQueries({
                                queryKey: ["chatRooms"],
                            });
                            return prev;
                        }

                        const room = prev[idx];
                        const isSelected =
                            selectedRoomIdRef.current === payload.chatRoomId;

                        const updated: ChatRoomData = {
                            ...room,
                            lastMessage: payload.lastMessage,
                            lastMessageTime: isSelected
                                ? "방금 전"
                                : payload.lastMessageTime,
                            lastMessageAt:
                                payload.lastMessageAt ?? room.lastMessageAt,
                        };

                        const next = prev.slice();
                        next.splice(idx, 1);
                        next.unshift(updated);
                        return next;
                    }
                );
            }
        );

        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
        };
    }, [clientRef, connected, queryClient, selectedRoomId]);
}
