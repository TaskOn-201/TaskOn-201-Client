import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTaskRequest, getTaskDetail } from "./taskApi";
import { toast } from "sonner";

interface UseTaskDetailParams {
  projectId: number;
  taskId: number;
  enabled?: boolean;
}

export const useTaskDetail = ({
  projectId,
  taskId,
  enabled = true,
}: UseTaskDetailParams) => {
  const queryClient = useQueryClient();

  const { data: taskResponse, isLoading } = useQuery({
    queryKey: ["taskDetail", projectId, taskId],
    queryFn: () => getTaskDetail(projectId, taskId),
    enabled: enabled && !!projectId && !!taskId,
  });

  const task = taskResponse?.data;

  const deleteTask = async (onSuccess?: () => void) => {
    try {
      await deleteTaskRequest(projectId, taskId);
      toast.success("Task 삭제 성공");
      // 보드 task 목록 캐시 무효화하여 UI 즉시 업데이트
      await queryClient.invalidateQueries({
        queryKey: ["boardTasks", projectId],
      });
      onSuccess?.();
    } catch (error) {
      console.error("Task 삭제 실패:", error);
    }
  };

  return {
    task,
    isLoading,
    deleteTask,
  };
};
