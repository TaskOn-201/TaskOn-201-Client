"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectMembersRequest,
  inviteProjectMembersRequest,
} from "./projectApi";
import { toast } from "sonner";

interface UseProjectMembersParams {
  projectId: number | null;
  enabled?: boolean;
}

export const useProjectMembers = ({
  projectId,
  enabled = true,
}: UseProjectMembersParams) => {
  const queryClient = useQueryClient();

  const {
    data: membersResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembersRequest(projectId!),
    enabled: enabled && !!projectId,
  });

  const members = membersResponse?.data ?? [];

  // 리더 찾기
  const leader = members.find((m) => m.role === "LEADER");
  // 일반 멤버들
  const regularMembers = members.filter((m) => m.role === "MEMBER");

  // 멤버 초대
  const inviteMembers = async (userIds: number[], onSuccess?: () => void) => {
    if (!projectId || userIds.length === 0) return;

    try {
      await inviteProjectMembersRequest(projectId, userIds);
      toast.success("멤버가 성공적으로 추가되었습니다.");
      // 프로젝트 멤버 캐시 무효화하여 UI 즉시 업데이트
      await queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      onSuccess?.();
    } catch (error) {
      console.error("멤버 초대 실패:", error);
      toast.error("멤버 초대에 실패했습니다.");
    }
  };

  // 캐시 무효화 함수 (외부에서 필요할 때 사용)
  const invalidateMembers = () => {
    queryClient.invalidateQueries({
      queryKey: ["projectMembers", projectId],
    });
  };

  return {
    members,
    leader,
    regularMembers,
    isLoading,
    refetch,
    inviteMembers,
    invalidateMembers,
  };
};

