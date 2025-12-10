import { authFetch } from "../auth/authFetch";

export class TaskApiError extends Error {
  status?: number;
  data?: string;
}

// Task 타입
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  participantIds: number[];
  startDate?: string;
  dueDate?: string;
  description?: string;
}

export interface TaskData {
  taskId: number;
  projectId: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  participantIds: number[];
  startDate: string;
  dueDate: string;
  description: string;
}

interface CreateTaskResponse {
  statusCode: number;
  message: string;
  data: TaskData;
}

// Task 생성
export async function createTaskRequest(
  projectId: number,
  payload: CreateTaskPayload
): Promise<CreateTaskResponse> {
  const res = await authFetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new TaskApiError(body.message || "Task 생성 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as CreateTaskResponse;
}
