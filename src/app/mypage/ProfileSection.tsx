"use client";

import Button from "@/components/Button";
import EditableProfile from "@/app/mypage/EditableProfile";
import Input from "@/components/Input";
import { ApiError } from "@/lib/auth/authApi";
import { AuthUser, saveAuth } from "@/lib/auth/authStorage";
import { profileUpdateRequest } from "@/lib/user/userApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileSectionProps {
    user: AuthUser;
    accessToken: string | null;
    setAuth: (token: string, user: AuthUser) => void;
}

const ProfileSection = ({
    user,
    accessToken,
    setAuth,
}: ProfileSectionProps) => {
    const [name, setName] = useState(user.name);
    const [profileImageUrl, setProfileImageUrl] = useState<File | null>(null);
    const queryClient = useQueryClient();

    const profileUpdateMutation = useMutation({
        mutationFn: profileUpdateRequest,
        onSuccess: (user) => {
            if (accessToken) {
                setAuth(accessToken, user);
                saveAuth(accessToken, user);
            }
            queryClient.setQueryData(["me"], user);
            toast.success("프로필이 성공적으로 업데이트되었습니다.");
            setProfileImageUrl(null);
        },
        onError: (error: ApiError) => {
            const status = error.status;
            if (status === 400) {
                toast.error("잘못된 요청입니다.");
            } else if (status === 500) {
                toast.error("네트워크 오류가 발생했습니다");
            } else {
                toast.error(
                    error.message || "프로필 업데이트 중 오류가 발생했습니다."
                );
            }
        },
    });

    const handleSaveProfile = () => {
        profileUpdateMutation.mutate({
            name: name,
            profileImageUrl: profileImageUrl,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-8">
                {/* 프로필 이미지 */}
                <div className="shrink-0">
                    <EditableProfile
                        currentImageUrl={user.profileImageUrl}
                        userName={name}
                        className="w-32 h-32"
                        onFileChange={(file) => {
                            setProfileImageUrl(file);
                        }}
                    />
                </div>

                {/* 프로필 정보 */}
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <Input value={user.email ?? ""} disabled fullWidth />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이름
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                            fullWidth
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            label="저장"
                            variant="primary"
                            className="px-4 py-2"
                            size="sm"
                            onClick={handleSaveProfile}
                            disabled={profileUpdateMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
