"use client";

import PageHeader from "@/components/PageHeader";
import ChangePasswordSection from "./ChangePasswordSection";
import DeactivateAccountSection from "./DeactivateAccountSection";
import ProfileSection from "./ProfileSection";
import { useAuthStore } from "@/store/useAuthStore";

export default function MyPage() {
    const { user, accessToken, setAuth } = useAuthStore();

    if (!user) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="min-h-screen">
            <PageHeader left="Settings" />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <ProfileSection user={user} accessToken={accessToken} setAuth={setAuth} />
                <ChangePasswordSection />
                <DeactivateAccountSection />
            </div>
        </div>
    );
}
