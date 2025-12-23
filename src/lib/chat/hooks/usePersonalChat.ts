"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrGetPersonalChat } from "@/lib/chat/chatApi";

export function usePersonalChat() {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) =>
      createOrGetPersonalChat(targetUserId),

    onSuccess: async () => {
      
      // 채팅방 리스트 최신화
      await queryclient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });
}
