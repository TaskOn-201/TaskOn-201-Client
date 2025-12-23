"use client"

import { useQuery } from "@tanstack/react-query";
import { getChatUserProfile } from "../chatApi";
import { ApiError } from "@/lib/auth/authApi";

export function useUserProfile(userId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getChatUserProfile(userId as number),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분 정도 캐시
    retry: (count, err:ApiError) => {
      // 404는 재시도 불필요
      if (err?.status === 404) return false;
      return count < 1;
    },
  });
}