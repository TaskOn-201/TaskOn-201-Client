import { authFetch } from "../auth/authFetch";
import { ApiError } from "../auth/authApi";

interface CommentBasePayload {
    projectId: number;
    taskId: number;
}

interface CommentCreatePayload extends CommentBasePayload {
    content: string;
}

interface CommentUpdatePayload extends CommentBasePayload {
    commentId: number;
    content: string;
}

interface CommentDeletePayload extends CommentBasePayload {
    commentId: number;
}

export interface CommentData {
    commentId: number;
    taskId: number;
    author: CommentAuthorData;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface CommentAuthorData {
    userId: number;
    name: string;
    profileImageUrl: string;
}

interface CommentResponse {
    statusCode: number;
    message: string;
    data: CommentData;
}

interface CommentUpdateData {
    commentId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface CommentUpdateResponse {
    statusCode: number;
    message: string;
    data: CommentUpdateData;
}

interface CommentDeleteResponse {
    statusCode: number;
    message: string;
    data: null;
}

// 댓글 생성
export async function createCommentRequest({
    projectId,
    taskId,
    content,
}: CommentCreatePayload): Promise<void> {
    const res = await authFetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments`,
        {
            method: "POST",
            body: JSON.stringify({ content }),
        }
    );

    const body: CommentResponse = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "comment 생성 불가");
    }
}

// 댓글 리스트 조회
export async function getComments({
    projectId,
    taskId,
}: CommentBasePayload): Promise<CommentData[]> {
    const res = await authFetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments`,
        {
            method: "GET",
        }
    );

    const body = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "comment list 확인 불가");
    }

    return body.data as CommentData[];
}

// 댓글 수정
export async function updateCommentRequest({
    projectId,
    taskId,
    commentId,
    content,
}: CommentUpdatePayload): Promise<void> {
    const res = await authFetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
            method: "PATCH",
            body: JSON.stringify({ content }),
        }
    );

    const body: CommentUpdateResponse = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "comment 수정 불가");
    }
}

// 댓글 삭제
export async function deleteCommentRequest({
    projectId,
    taskId,
    commentId,
}: CommentDeletePayload): Promise<void> {
    const res = await authFetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
            method: "DELETE",
        }
    );

    const body: CommentDeleteResponse = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "comment 삭제 불가");
    }
}
