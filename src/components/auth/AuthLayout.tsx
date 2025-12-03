"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "../ui/sonner";

interface AuthLayoutProps {
  children: ReactNode;
  isSignUp: boolean;
  onToggle: () => void;
}

export default function AuthLayout({
  children,
  isSignUp,
  onToggle,
}: AuthLayoutProps) {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // 최소 너비 1024px, 최소 높이 500px
      setIsScreenTooSmall(window.innerWidth < 1024 || window.innerHeight < 500);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isScreenTooSmall) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray1">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray5 mb-3">
            화면이 너무 작습니다
          </h2>
          <p className="text-gray4 mb-2">
            더 나은 경험을 위해 화면 크기를 키워주세요.
          </p>
          <p className="text-sm text-gray3">최소 권장 크기: 1024px × 500px</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray1">
      <div className="w-full max-w-6xl h-[600px] sm:h-[650px] lg:h-[700px] flex relative overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* 오버레이 패널 - 로그인을 위한 슬라이딩 애니메이션 */}
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out pointer-events-none ${
            isSignUp ? "translate-x-full z-0" : "translate-x-0 z-30"
          }`}
        >
          <div className="flex w-full h-full">
            {/* 왼쪽 오버레이 - 로그인 모드일 때 표시 */}
            <div
              className={`flex w-full lg:w-1/2 h-full bg-linear-to-br from-teal-400 via-cyan-400 to-blue-400 items-center justify-center p-8 lg:p-12 transition-opacity duration-700 pointer-events-auto ${
                isSignUp ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 데코레이션션 */}
                <div
                  className="absolute top-4 sm:top-10 lg:top-20 right-8 sm:right-16 lg:right-32 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-orange-400 rounded-full opacity-70 animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "3s" }}
                ></div>
                <div
                  className="absolute top-6 sm:top-16 lg:top-32 left-4 sm:left-10 lg:left-20 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-red-400 rounded-3xl opacity-80 animate-bounce"
                  style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
                ></div>
                <div
                  className="absolute bottom-8 sm:bottom-16 lg:bottom-32 right-10 sm:right-20 lg:right-40 w-6 h-12 sm:w-10 sm:h-20 lg:w-12 lg:h-24 bg-yellow-300 rounded-full opacity-75 animate-bounce"
                  style={{ animationDelay: "1s", animationDuration: "3.5s" }}
                ></div>
                <div
                  className="absolute bottom-10 sm:bottom-20 lg:bottom-40 left-8 sm:left-16 lg:left-32 w-12 h-6 sm:w-20 sm:h-10 lg:w-24 lg:h-12 bg-lime-400 rounded-3xl opacity-70 animate-bounce"
                  style={{ animationDelay: "1.5s", animationDuration: "2.8s" }}
                ></div>

                <AuthOverlayContent
                  title="Join Us Today!"
                  emoji="✨"
                  description="이미 계정이 있으신가요? 로그인해주세요"
                  buttonLabel="Sign In"
                  onButtonClick={onToggle}
                />
              </div>
            </div>

            {/* 오른쪽 공간(투명) */}
            <div className="flex-1"></div>
          </div>
        </div>

        {/* 오버레이 패널 - 가입을 위한 슬라이딩 애니메이션 */}
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out pointer-events-none ${
            isSignUp ? "translate-x-0 z-30" : "-translate-x-full z-0"
          }`}
        >
          <div className="flex w-full h-full">
            {/* 왼쪽 공간(투명) */}
            <div className="flex-1"></div>

            {/* 오른쪽 오버레이 - 가입 모드일 때 표시 */}
            <div
              className={`flex w-full lg:w-1/2 h-full bg-linear-to-br from-cyan-500 via-teal-400 to-blue-500 items-center justify-center p-8 lg:p-12 transition-opacity duration-700 pointer-events-auto ${
                isSignUp ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 데코레이션 */}
                <div
                  className="absolute top-6 sm:top-12 lg:top-24 right-6 sm:right-14 lg:right-28 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-orange-300 rounded-full opacity-80 animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "3s" }}
                ></div>
                <div
                  className="absolute top-10 sm:top-20 lg:top-40 left-6 sm:left-12 lg:left-24 w-10 h-5 sm:w-16 sm:h-8 lg:w-20 lg:h-10 bg-red-400 rounded-3xl opacity-75 animate-bounce"
                  style={{ animationDelay: "0.7s", animationDuration: "2.5s" }}
                ></div>
                <div
                  className="absolute bottom-9 sm:bottom-18 lg:bottom-36 right-9 sm:right-18 lg:right-36 w-7 h-14 sm:w-11 sm:h-22 lg:w-14 lg:h-28 bg-yellow-300 rounded-full opacity-70 animate-bounce"
                  style={{ animationDelay: "1.2s", animationDuration: "3.2s" }}
                ></div>
                <div
                  className="absolute bottom-8 sm:bottom-16 lg:bottom-32 left-7 sm:left-14 lg:left-28 w-14 h-7 sm:w-22 sm:h-11 lg:w-28 lg:h-14 bg-lime-400 rounded-3xl opacity-80 animate-bounce"
                  style={{ animationDelay: "1.8s", animationDuration: "2.8s" }}
                ></div>

                <AuthOverlayContent
                  title="Welcome Back!"
                  emoji="👋"
                  description="처음이신가요? 회원가입을 진행해주세요"
                  buttonLabel="Sign Up"
                  onButtonClick={onToggle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 폼 컨테이너너 */}
        <div className="w-full h-full flex relative z-10">{children}</div>
      </div>
    </div>
  );
}

interface AuthOverlayContentProps {
  title: string;
  emoji: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

function AuthOverlayContent({
  title,
  emoji,
  description,
  buttonLabel,
  onButtonClick,
}: AuthOverlayContentProps) {
  return (
    <div className="text-center text-white z-10 px-4">
      <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4 lg:mb-6">
        {emoji}
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">
        {title}
      </h2>
      <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 opacity-90 hidden sm:block">
        {description}
      </p>
      <button
        onClick={onButtonClick}
        className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 border-2 border-white text-sm sm:text-base bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
      >
        {buttonLabel}
      </button>
      <Toaster richColors position="top-center" />
    </div>
  );
}
