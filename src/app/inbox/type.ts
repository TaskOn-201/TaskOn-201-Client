export type chatType = "PROJECT_GROUP" | "TASK_GROUP" | "PERSONAL";

interface ParticipantsData {
    userId: number;
    name: string;
    profileImageUrl: string;
}

export interface ChatRoomData {
    chatRoomId: number;
    roomName: string;
    chatType: chatType;
    participants: ParticipantsData[];
    lastMessage: string | null;
    lastMessageTime: string | null;
    lastMessageAt: string | null;
    unreadCount: number;

    // 채팅 검색 시
    relatedTaskId?: number;
}

export interface ChatMessage {
    messageId: number;
    chatRoomId: number;
    sender: {
        userId: number;
        name: string | null;
        profileImageUrl?: string | null;
    };
    content: string;
    sentTime: string;
    displayTime: string;
}
