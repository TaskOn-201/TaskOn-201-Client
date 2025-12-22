import { ChatMessage } from "@/app/inbox/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessageHistory } from "../chatApi";
import { useEffect } from "react";

export function useChatMessageHistory(chatRoomId: number | null) {
    const queryClient = useQueryClient();

    const query = useQuery<ChatMessage[]>({
        queryKey: ["chatMessages", chatRoomId],
        queryFn: () => getChatMessageHistory(chatRoomId as number),
        enabled: !!chatRoomId,
        staleTime: 5000,
    });

    useEffect(() => {
        if (!chatRoomId) return;
        if (!query.isSuccess) return;

        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    }, [chatRoomId, query.isSuccess, query.dataUpdatedAt, queryClient]);

    return query;
}
