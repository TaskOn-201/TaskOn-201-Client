import PageHeader from "@/components/PageHeader";
import ChangePasswordSection from "./ChangePasswordSection";
import DeactivateAccountSection from "./DeactivateAccountSection";
import ProfileSection from "./ProfileSection";

export default function MyPage() {
  return (
    <div className="min-h-screen">
      <PageHeader left="Settings" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <ProfileSection />
        <ChangePasswordSection />
        <DeactivateAccountSection />
      </div>
    </div>
  );
}
