"use client";

import PageHeader from "@/components/PageHeader";
import ChangePasswordSection from "./ChangePasswordSection";
import DeactivateAccountSection from "./DeactivateAccountSection";
import ProfileSection from "./ProfileSection";
import useMe from "@/lib/user/useMe";
import { useRouter } from "next/navigation";

export default function MyPage() {
    const { data: user, isLoading } = useMe();
    const router = useRouter();

    if (isLoading) {
        return <div>불러오는 중...</div>;
    }
    if (!user) {
        router.replace("/login");
        return null;
    }

    return (
        <div className="min-h-screen">
            <PageHeader left="Settings" />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <ProfileSection user={user} />
                <ChangePasswordSection />
                <DeactivateAccountSection />
            </div>
        </div>
    );
}
