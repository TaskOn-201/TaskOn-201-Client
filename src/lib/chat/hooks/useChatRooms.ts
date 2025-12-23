"use client"

import { useQuery } from "@tanstack/react-query";
import { getChatRooms } from "../chatApi";
import { sortByLastMessageAtDesc } from "../chatUtils";

export function useChatRooms() {
    return useQuery({
        queryKey: ["chatRooms"],
        queryFn: getChatRooms,
        staleTime: 10_000,

        // 폴링 -> 실시간 채팅방 리스트
        refetchInterval: 3000,
        refetchOnWindowFocus: false,

        select: (rooms) => sortByLastMessageAtDesc(rooms),
    });
}
