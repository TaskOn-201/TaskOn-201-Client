"use client"

import { useQuery } from "@tanstack/react-query";
import {
    searchChatUsers,
    SearchChatUsersData,
} from "@/lib/chat/chatApi";
import { ApiError } from "../../auth/authApi";

interface Params {
    keyword: string;
    page?: number;
    size?: number;
    sort?: string[];
};

export function useChatUserSearch({
    keyword,
    page = 0,
    size = 20,
    sort = [],
}: Params) {
    const keywordTrimmed = keyword.trim();
    const sortKey = sort.join(",");

    return useQuery<SearchChatUsersData, ApiError>({
        queryKey: ["chatUserSearch", keywordTrimmed, page, size, sortKey],
        enabled: keywordTrimmed.length >= 1,
        queryFn: async () => {
            return await searchChatUsers({
                keyword: keywordTrimmed,
                page,
                size,
                sort,
            });
        },
        staleTime: 3_000,
    });
}
