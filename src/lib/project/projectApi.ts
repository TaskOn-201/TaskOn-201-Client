import { authFetch } from "../auth/authFetch";

export interface Project {
  projectId: number;
  projectName: string;
  myRole: "LEADER" | "MEMBER";
}

interface ProjectListResponse {
  statusCode: number;
  message: string;
  data: Project[];
}

interface ProjectCreateResponse {
  statusCode: number;
  message: string;
  data: {
    projectId: number;
    projectName: string;
    projectDescription: string;
  };
}
interface ProjectDeleteResponse {
  statusCode: number;
  message: string;
  data: null;
}
interface CreateProjectPayload {
  projectName: string;
  projectDescription?: string;
}

export class ProjectApiError extends Error {
  status?: number;
  data?: string;
}

// 프로젝트 목록 조회
export async function getProjectsRequest(): Promise<ProjectListResponse> {
  const res = await authFetch("/api/projects", {
    method: "GET",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(
      body.message || "프로젝트 목록 조회 실패"
    );
    error.status = res.status;
    throw error;
  }

  return body as ProjectListResponse;
}

// 프로젝트 생성
export async function createProjectRequest({
  projectName,
  projectDescription,
}: CreateProjectPayload): Promise<ProjectCreateResponse> {
  const res = await authFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify({ projectName, projectDescription }),
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(body.message || "프로젝트 생성 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as ProjectCreateResponse;
}

// 프로젝트 삭제
export async function deleteProjectRequest(
  projectId: number,
  projectName: string
): Promise<ProjectDeleteResponse> {
  const res = await authFetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    body: JSON.stringify({ projectName }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new ProjectApiError(body.message || "프로젝트 삭제 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }
  return body as ProjectDeleteResponse;
}
