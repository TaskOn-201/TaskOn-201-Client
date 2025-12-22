import { useUserProfile } from "@/lib/chat/hooks/useChatUserProfile";
import { toast } from "sonner";
import UserInfoModal from "../modal/UserInfoModal";
import Profile from "../Profile";
import { useEffect, useMemo, useRef } from "react";
import { ApiError } from "@/lib/auth/authApi";

export default function UserProfileModal({
    isOpen,
    onClose,
    userId,
}: {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
}) {
    const { data, isLoading, isError, error } = useUserProfile(userId, isOpen);
    const toastedRef = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            toastedRef.current = false;
            return;
        }
        if (!isError || toastedRef.current) return;

        toastedRef.current = true;
        const err = error as ApiError;

        toast.error(err.data || err.message || "사용자를 찾을 수 없습니다.");
        onClose();
    }, [isOpen, isError, error, onClose]);

    // data가 있을 때만 모달
    const shouldOpen = useMemo(() => {
        if (!isOpen || !userId) return false;
        if (isError) return false;
        return !!data; //data 도착 전엔 모달 자체를 안 띄움
    }, [isOpen, userId, isError, data]);

    return (
        <UserInfoModal
            titleNode={
                <span className="text-2xl font-bold text-gray5">Profile</span>
            }
            isOpen={shouldOpen}
            onClose={onClose}
            className="max-w-lg"
        >
            {isLoading && (
                <div className="py-20 text-center text-sm text-gray3">
                    불러오는 중...
                </div>
            )}

            {!isLoading && data && (
                <div className="flex items-center gap-8 px-6 py-8">
                    {/* 좌측 프로필 */}
                    <div className="shrink-0">
                        <Profile
                            size="lg"
                            imageUrl={data.profileImageUrl ?? undefined}
                            userName={data.name ?? "탈퇴한 사용자"}
                            className="w-28 h-28 text-3xl"
                        />
                    </div>

                    {/* 우측 정보 */}
                    <div className="flex flex-col gap-3 min-w-0">
                        <div className="text-lg font-semibold text-gray5">
                            {data.name ?? "탈퇴한 사용자"}
                        </div>
                        <div className="text-sm text-gray3">{data.email}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.projects.length === 0 && (
                                <span className="text-sm text-gray3">
                                    참여 중인 프로젝트 없음
                                </span>
                            )}

                            {data.projects.map((project) => (
                                <span
                                    key={project.projectId}
                                    className="
                                      px-3 py-1
                                      rounded-full
                                      bg-gray1
                                      text-sm
                                      text-gray5
                                    "
                                >
                                    {project.projectName}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </UserInfoModal>
    );
}
