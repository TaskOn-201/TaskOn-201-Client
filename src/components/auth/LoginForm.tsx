"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface LoginFormProps {
  isVisible: boolean;
}

export default function LoginForm({ isVisible }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  const handleKakaoLogin = () => {
    console.log("Kakao Login");
  };

  return (
    <div
      className={`flex items-center justify-center lg:justify-start p-6 sm:p-8 lg:pl-12 xl:pl-16 bg-white transition-all duration-700 ease-in-out absolute left-0 w-full lg:w-1/2 h-full overflow-y-auto ${
        !isVisible
          ? "opacity-0 pointer-events-none z-0"
          : "opacity-100 pointer-events-auto z-40"
      }`}
    >
      <div className="w-full max-w-md px-2 sm:px-4 lg:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray5 mb-2">
            로그인
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            label="Sign In"
            variant="primary"
            size="md"
            fullWidth
            className="mt-6"
          />
        </form>

        <div className="mt-6 sm:mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray2"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray4">OR</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="mt-6 max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Image
                src="/kakao_login_large_wide.png"
                alt="카카오 로그인"
                width={300}
                height={90}
                className="w-full h-auto"
                priority
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
