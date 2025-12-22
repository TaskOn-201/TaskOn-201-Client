import { ChatMessage, ChatRoomData } from "@/app/inbox/type";
import { ApiError } from "../auth/authApi";
import { authFetch } from "../auth/authFetch";
import { TaskPriority } from "../task/taskApi";

export interface ChatUser {
    userId: number;
    name: string;
    email: string;
    profileImageUrl: string | null;
}

interface SearchChatUsersPayload {
    keyword: string;
    page?: number;
    size?: number;
    sort?: string[];
}

export interface SearchChatUsersResponse {
    statusCode: number;
    message: string;
    data: SearchChatUsersData;
}

export interface SearchChatUsersData {
    content: ChatUser[];
    size: number;
    number: number;
    hasNext: boolean;
}

export interface ChatSearchResponse {
    statusCode: number;
    message: string;
    data: {
        chatRooms: ChatRoomData[];
    };
}

export interface ChatSearchUser {
    userId: number;
    name: string;
    profileImageUrl: string | null;
}

export interface ChatSearchTask {
    taskId: number;
    projectId: number;
    taskTitle: string;
    priority: TaskPriority;
}

export interface ChatSearchData {
    users: ChatSearchUser[];
    tasks: ChatSearchTask[];
}

// 메세지 리스트 조회
export async function getChatMessageHistory(
    chatRoomId: number
): Promise<ChatMessage[]> {
    const res = await authFetch(`/api/chat/rooms/${chatRoomId}/messages`, {
        method: "GET",
    });

    const body = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "채팅 메세지 히스토리 조회 실패");
    }

    return body.data as ChatMessage[];
}

// 채팅방 리스트 조회
export async function getChatRooms(): Promise<ChatRoomData[]> {
    const res = await authFetch("/api/chat/rooms", {
        method: "GET",
    });

    const body = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "채팅방 리스트 조회 실패");
    }

    return body.data as ChatRoomData[];
}

// 채팅 사용자 검색
export async function searchChatUsers({
    keyword,
    page = 0,
    size = 20,
}: SearchChatUsersPayload) {
    const params = new URLSearchParams({
        keyword,
        page: page.toString(),
        size: size.toString(),
    });
    const res = await authFetch(
        `/api/chat/personal/search?${params.toString()}`,
        { method: "GET" }
    );

    const body: SearchChatUsersResponse = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "사용자 검색에 실패");
        error.status = res.status;
        throw error;
    }

    return body.data;
}

// 채팅방을 만들고 개인 채팅방 가져오기
export async function createOrGetPersonalChat(targetUserId: number) {
    const res = await authFetch("/api/chat/personal", {
        method: "POST",
        body: JSON.stringify({ targetUserId }),
    });

    const body = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "개인 채팅방 만들기 실패");
        error.status = res.status;
        throw error;
    }
    return body as { chatRoomId: number };
}

// 채팅 검색
export async function searchChat(keyword: string): Promise<ChatRoomData[]> {
    const res = await authFetch(
        `/api/chat/search?keyword=${encodeURIComponent(keyword)}`,
        {
            method: "GET",
        }
    );

    const body: ChatSearchResponse = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "채팅 검색 실패");
        error.status = res.status;
        throw error;
    }

    return body.data.chatRooms;
}
