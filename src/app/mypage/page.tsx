"use client";

import PageHeader from "@/components/PageHeader";
import ChangePasswordSection from "./ChangePasswordSection";
import DeactivateAccountSection from "./DeactivateAccountSection";
import ProfileSection from "./ProfileSection";
import useMe from "@/lib/user/useMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div>불러오는 중...</div>;
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