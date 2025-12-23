"use client"

import { searchChat } from './../chatApi';
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/auth/authApi";
import { ChatRoomData } from '@/app/inbox/type';

export function useChatSearch(keyword: string) {
    const trimmed = keyword.trim();

    return useQuery<ChatRoomData[], ApiError>({
        queryKey: ["chatSearch", trimmed],
        enabled: trimmed.length >= 1,
        queryFn: () => searchChat(trimmed),
        placeholderData: (prev) => prev,
        staleTime: 3_000,
    });
}
