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

// 프로젝트 멤버 조회
export interface ProjectMember {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string;
  role: "LEADER" | "MEMBER";
}

interface ProjectMembersResponse {
  statusCode: number;
  message: string;
  data: ProjectMember[];
}

export async function getProjectMembersRequest(
  projectId: number
): Promise<ProjectMembersResponse> {
  const res = await authFetch(`/api/projects/${projectId}/members`, {
    method: "GET",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(body.message || "멤버 조회 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as ProjectMembersResponse;
}

// 프로젝트 멤버 검색
export interface SearchedMember {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string;
}

interface MemberSearchResponse {
  statusCode: number;
  message: string;
  data: {
    content: SearchedMember[];
    size: number;
    number: number;
    hasNext: boolean;
  };
}

interface MemberSearchParams {
  projectId: number;
  keyword: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export async function searchProjectMembersRequest({
  projectId,
  keyword,
  page = 0,
  size = 10,
  sort = ["name"],
}: MemberSearchParams): Promise<MemberSearchResponse> {
  const params = new URLSearchParams({
    keyword,
    page: page.toString(),
    size: size.toString(),
  });

  sort.forEach((s) => params.append("sort", s));

  const res = await authFetch(
    `/api/projects/${projectId}/members/search?${params.toString()}`,
    {
      method: "GET",
    }
  );

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(body.message || "멤버 검색 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as MemberSearchResponse;
}

// 프로젝트 멤버 초대
interface InviteMembersResponse {
  statusCode: number;
  message: string;
  data: null;
}

export async function inviteProjectMembersRequest(
  projectId: number,
  userIds: number[]
): Promise<InviteMembersResponse> {
  const res = await authFetch(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(body.message || "멤버 초대 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as InviteMembersResponse;
}

// 프로젝트 멤버 삭제
interface RemoveMemberResponse {
  statusCode: number;
  message: string;
  data: Record<string, never>;
}

export async function removeProjectMemberRequest(
  projectId: number,
  userId: number
): Promise<RemoveMemberResponse> {
  const res = await authFetch(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(body.message || "멤버 삭제 실패");
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as RemoveMemberResponse;
}

// 프로젝트 사이드바 정보 조회
export interface OnlineUser {
  userId: number;
  name: string;
  profileImageUrl: string;
  online: boolean;
}

export interface ProjectSidebarData {
  project: {
    projectId: number;
    projectName: string;
  };
  onlineUsers: OnlineUser[];
  unreadChatCount: number;
}

interface ProjectSidebarResponse {
  statusCode: number;
  message: string;
  data: ProjectSidebarData;
}

export async function getProjectSidebarRequest(
  projectId: number
): Promise<ProjectSidebarResponse> {
  const res = await authFetch(`/api/projects/${projectId}/sidebar`, {
    method: "GET",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new ProjectApiError(
      body.message || "사이드바 정보 조회 실패"
    );
    error.status = res.status;
    error.data = body.data;
    throw error;
  }

  return body as ProjectSidebarResponse;
}
