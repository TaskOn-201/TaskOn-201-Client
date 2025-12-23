"use client"

import { Client } from "@stomp/stompjs";
import { RefObject } from "react";

// 메시지 보내기 STOMP
export function sendChatMessage(
    clientRef: RefObject<Client | null>,
    chatRoomId: number,
    content: string
) {
    const client = clientRef.current;
    if (!client || !client.connected) throw new Error("STOMP 연결 실패");

    client.publish({
        destination: `/app/chat/rooms/${chatRoomId}`,
        body: JSON.stringify({ content }), // 매핑
    });
}