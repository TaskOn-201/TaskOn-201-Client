import { ChatMessage } from "@/app/inbox/type";

// sender 찾기 -> 메세지 실시간 전송시 senderId 값만 존재하므로 Rest message 조회에서 찾도록
export function findSender(
    messages: ChatMessage[] | undefined,
    senderId: number
) {
    return messages?.find((m) => m.sender.userId === senderId)?.sender;
}

// 채팅방 리스트 조회 날짜 변환용
// value: "251113T231154"
export const parseCompactDateTime = (value: string): Date | null => {
    if (!/^\d{6}T\d{6}$/.test(value)) return null;

    const y = Number(value.slice(0, 2));
    const m = Number(value.slice(2, 4));
    const d = Number(value.slice(4, 6));
    const h = Number(value.slice(7, 9));
    const min = Number(value.slice(9, 11));
    const s = Number(value.slice(11, 13));

    const year = 2000 + y;

    return new Date(year, m - 1, d, h, min, s);
};

// 24시간이 넘어가면 "방금전" -> 2025-12-21 형태로
export const formatChatRoomTime = (value: string | null) => {
    if (!value) return "";

    // 그냥 문자열이면 그대로 사용 ("방금전","10분 전"...)
    if (!value.includes("T")) {
        return value;
    }

    const date = parseCompactDateTime(value);
    if (!date) return value;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        const h = date.getHours().toString().padStart(2, "0");
        const m = date.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    const y = date.getFullYear();
    const mo = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${mo}-${d}`;
};

export function sortByLastMessageAtDesc<T extends { lastMessageAt?: string | null }>(
  rooms: T[]
) {
  return [...rooms].sort((a, b) => {
    const aTime = a.lastMessageAt ? Date.parse(a.lastMessageAt) : 0;
    const bTime = b.lastMessageAt ? Date.parse(b.lastMessageAt) : 0;
    return bTime - aTime;
  });
}

// 룸 최신 반영 -> 폴링 시 사용
// export const invalidateRooms = debounce((queryClient) => {
//     queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
// }, 300);
