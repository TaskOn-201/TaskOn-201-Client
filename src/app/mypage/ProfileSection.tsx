"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Profile from "@/components/Profile";
import { useState } from "react";

export default function ProfileSection() {
  const [email, setEmail] = useState("123@123.com");
  const [nickname, setNickname] = useState("사용자1");

  const handleSaveProfile = () => {
    // 프로필 저장 로직
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start gap-8">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          <Profile
            imageUrl="/images/profile.jpg"
            userName={nickname}
            className="w-32 h-32"
          />
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <Input value={email} disabled fullWidth />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              fullWidth
            />
          </div>

          <div className="flex justify-end">
            <Button
              label="저장"
              variant="primary"
              className="px-4 py-3"
              onClick={handleSaveProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
