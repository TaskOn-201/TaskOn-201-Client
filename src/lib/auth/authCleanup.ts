"use client"

import { QueryClient } from "@tanstack/react-query";

// 로그아웃, 탈퇴 시 사용
export function authCleanup(queryClient: QueryClient) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("project-storage");
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("zustand-persist");

  queryClient.clear();
}