"use client";

import { useCallback, useMemo, useState } from "react";
import UserInfoModal from "@/components/modal/UserInfoModal";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import useMe from "@/lib/user/useMe";
import { useChatUserSearch } from "@/lib/chat/hooks/useChatUserSearch";
import { usePersonalChat } from "@/lib/chat/hooks/usePersonalChat";
import { useDebounce } from "@/lib/useDebounce";
import { toast } from "sonner"; // 너 토스트 라이브러리에 맞춰 수정
import { ChatRoomData } from "@/app/inbox/type"; // 경로 맞춰
import { ApiError } from "@/lib/auth/authApi";

export default function SearchChatUsersModal({
    isOpen,
    onClose,
    onCreated,
    rooms,
    myUserId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (chatRoomId: number) => void;
    rooms: ChatRoomData[];
    myUserId?: number;
}) {
    const { data: me } = useMe();
    const realMyUserId = myUserId ?? me?.userId;

    const [keywordInput, setKeywordInput] = useState("");
    const keyword = useDebounce(keywordInput, 300);

    const {
        data: slice,
        isLoading,
        isError,
    } = useChatUserSearch({
        keyword,
        page: 0,
        size: 20,
    });

    const personalChat = usePersonalChat();

    const users = slice?.content ?? [];
    const hasSearched = keyword.trim().length > 0;

    const handleClose = useCallback(() => {
        setKeywordInput("");
        onClose();
    }, [onClose]);

    // 상대 userId -> 기존 personal roomId 맵
    const personalRoomByPartnerId = useMemo(() => {
        const map = new Map<number, number>();
        if (!realMyUserId) return map;

        rooms
            .filter((room) => room.chatType === "PERSONAL")
            .forEach((room) => {
                const partner = room.participants.find(
                    (participant) => participant.userId !== realMyUserId
                );
                if (partner) map.set(partner.userId, room.chatRoomId);
            });

        return map;
    }, [rooms, realMyUserId]);

    const handlePickUser = (userId: number) => {
        if (realMyUserId && userId === realMyUserId) return;

        // 이미 개인방 있으면 기존방 이동
        const existingRoomId = personalRoomByPartnerId.get(userId);
        if (existingRoomId) {
            toast.info(
                "이미 1:1 채팅방이 있어요. 기존 채팅방으로 이동합니다.",
                { duration: 3000 }
            );
            onCreated(existingRoomId);
            handleClose();
            return;
        }

        // 없으면 생성
        personalChat.mutate(userId, {
            onSuccess: ({ chatRoomId }) => {
                onCreated(chatRoomId);
                handleClose();
            },
            onError: (error: ApiError) => {
                const status = error.status;

                if (status === 400) {
                    toast.error("잘못된 요청입니다");
                } else if (status === 401) {
                    toast.error("인증이 만료되었습니다");
                } else if (status === 500) {
                    toast.error("네트워크 오류가 발생했습니다");
                } else {
                    toast.error(
                        error.message || "채팅방 생성 중 오류가 발생했습니다."
                    );
                }
            },
        });
    };

    const loading = isLoading || personalChat.isPending;

    return (
        <UserInfoModal
            isOpen={isOpen}
            onClose={handleClose}
            title="1:1 채팅 생성"
            className="max-w-lg max-h-[400px]"
        >
            <div className="flex flex-col gap-4">
                <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="사용자 검색 (이름/이메일)"
                    className="w-full px-4 py-3 border border-gray2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                />

                <div className="max-h-[360px] overflow-y-auto">
                    {loading && (
                        <div className="py-6 text-sm text-gray4">
                            검색 중...
                        </div>
                    )}

                    {!loading && isError && (
                        <div className="py-6 text-sm text-red-500">
                            다시 시도하세요
                        </div>
                    )}

                    {!loading && !isError && !hasSearched && (
                        <div className="py-6 text-sm text-gray4">
                            검색어를 입력해주세요
                        </div>
                    )}

                    {!loading &&
                        !isError &&
                        hasSearched &&
                        users.length === 0 && (
                            <div className="py-6 text-sm text-gray4">
                                검색 결과가 없습니다
                            </div>
                        )}

                    <div className="flex flex-col">
                        {users.map((user) => {
                            const existingRoomId = personalRoomByPartnerId.get(
                                user.userId
                            );

                            return (
                                <button
                                    key={user.userId}
                                    onClick={() => handlePickUser(user.userId)}
                                    disabled={loading}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray1/40 text-left disabled:opacity-50 cursor-pointer"
                                >
                                    <Profile
                                        size="sm"
                                        imageUrl={
                                            user.profileImageUrl ?? undefined
                                        }
                                        userName={user.name}
                                    />

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-gray5 truncate">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-gray3 truncate">
                                            {user.email}
                                        </span>
                                    </div>

                                    {existingRoomId && (
                                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray1 text-gray4">
                                            이미 대화 중
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="white"
                    size="sm"
                    label="닫기"
                    onClick={handleClose}
                />
            </div>
        </UserInfoModal>
    );
}
