"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { initialize, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.refresh();
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-black">
      <Header className="w-full h-20 flex justify-between items-center py-4 px-8 border-0 bg-white" />
      <main className="w-full flex flex-col items-center justify-center py-20 bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">팀 협업 관리 서비스</h1>
          <h5 className="text-lg pt-4">
            보다 효율적으로 협업을 할 수 있는 플랫폼으로 편리하게 소통하세요
          </h5>
        </div>
        <div>
          <Image
            src="/taskon-index-main.png"
            alt="TaskOn main image"
            width={400}
            height={50}
          />
        </div>
        <div className="py-10 flex gap-4">
          <Link href={isAuthenticated ? "/board" : "/login"}>
            <Button
              label="내 Board 보기"
              size="md"
              className="font-bold px-4 py-2"
            />
          </Link>
          <Link href={isAuthenticated ? "/projects" : "/login"}>
            <Button
              label="새 프로젝트 시작하기"
              size="md"
              className="font-bold px-4 py-2"
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
