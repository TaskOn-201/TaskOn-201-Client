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

// 사용자 정보 타입
export interface TaskUser {
  userId: number;
  name: string;
  profileImageUrl: string | null;
}

// Task 상세 응답 타입
export interface TaskDetailData {
  taskId: number;
  projectId: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TaskUser | null;
  participants: TaskUser[];
  startDate: string | null;
  dueDate: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// 기존 TaskData
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

// Board용 Task 타입
export interface BoardTaskItem {
  taskId: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeProfileImageUrl: string | null;
  participantProfileImageUrls: string[];
  commentCount: number;
}

export interface BoardData {
  todo: BoardTaskItem[];
  inProgress: BoardTaskItem[];
  completed: BoardTaskItem[];
}

interface GetBoardTasksResponse {
  statusCode: number;
  message: string;
  data: BoardData;
}

interface GetTaskDetailResponse {
  statusCode: number;
  message: string;
  data: TaskDetailData;
}

interface DeleteTaskResponse {
  statusCode: number;
  message: string;
  data: null;
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

// Task 보드 조회
export async function getBoardTasks(
  projectId: number,
  params?: {
    title?: string;
    priority?: TaskPriority;
    userId?: number;
  }
): Promise<GetBoardTasksResponse> {
  const searchParams = new URLSearchParams();
  if (params?.title) searchParams.set("title", params.title);
  if (params?.priority) searchParams.set("priority", params.priority);
  if (params?.userId) searchParams.set("userId", params.userId.toString());

  const queryString = searchParams.toString();
  const url = `/api/projects/${projectId}/tasks/board${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await authFetch(url, {
    method: "GET",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new TaskApiError(body.message || "Task 보드 조회 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as GetBoardTasksResponse;
}

// Task 상세 조회
export async function getTaskDetail(
  projectId: number,
  taskId: number
): Promise<GetTaskDetailResponse> {
  const res = await authFetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "GET",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new TaskApiError(body.message || "Task 상세 조회 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as GetTaskDetailResponse;
}

//Task 삭제
export async function deleteTaskRequest(
  projectId: number,
  taskId: number
): Promise<DeleteTaskResponse> {
  const res = await authFetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new TaskApiError(body.message || "Task 삭제 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }
  return body as DeleteTaskResponse;
}
