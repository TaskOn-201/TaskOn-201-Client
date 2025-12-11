import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectSidebarRequest } from "./projectApi";

interface UseProjectSidebarParams {
  projectId: number | null;
  enabled?: boolean;
}

export const SIDEBAR_QUERY_KEY = "projectSidebar";

export const useProjectSidebar = ({
  projectId,
  enabled = true,
}: UseProjectSidebarParams) => {
  const queryClient = useQueryClient();

  const {
    data: sidebarResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [SIDEBAR_QUERY_KEY, projectId],
    queryFn: () => getProjectSidebarRequest(projectId!),
    enabled: enabled && !!projectId,
    // 10초마다 자동으로 refetch (온라인 상태 갱신)
    refetchInterval: 10000,
    // 윈도우 포커스 시 refetch
    refetchOnWindowFocus: true,
  });

  const onlineUsers = sidebarResponse?.data.onlineUsers ?? [];
  const unreadChatCount = sidebarResponse?.data.unreadChatCount ?? 0;
  const project = sidebarResponse?.data.project ?? null;

  // 캐시 무효화 함수
  const invalidateSidebar = () => {
    queryClient.invalidateQueries({
      queryKey: [SIDEBAR_QUERY_KEY, projectId],
    });
  };

  // 전체 사이드바 캐시 무효화 (프로젝트 ID 무관)
  const invalidateAllSidebar = () => {
    queryClient.invalidateQueries({
      queryKey: [SIDEBAR_QUERY_KEY],
    });
  };

  return {
    onlineUsers,
    unreadChatCount,
    project,
    isLoading,
    refetch,
    invalidateSidebar,
    invalidateAllSidebar,
  };
};
