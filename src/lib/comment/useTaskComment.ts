"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCommentRequest,
    deleteCommentRequest,
    getComments,
    updateCommentRequest,
} from "./commentApi";
import { ApiError } from "../auth/authApi";
import { toast } from "sonner";

interface useTaskCommentParams {
    projectId: number;
    taskId: number;
}

export function useTaskComment({ projectId, taskId }: useTaskCommentParams) {
    const queryClient = useQueryClient();

    // comments 라는 키 이름의 고유 ID
    const queryKey = ["comments", projectId, taskId];

    // 조회
    const {
        data: comments = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey,
        queryFn: () => getComments({ projectId, taskId }),
        staleTime: 30 * 1000,
    });

    // 변경된 최신 상태 유지
    const invalidateComments = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    // 생성
    const createComment = useMutation<void, ApiError, string>({
        mutationFn: (content) =>
            createCommentRequest({ projectId, taskId, content }),
        onSuccess: () => {
            toast.success("comment를 등록하였습니다", { duration: 2000 });
            invalidateComments();
        },
        onError: (err) => {
            toast.error(err.message || "comment 등록에 실패하였습니다");
        },
    });

    // 수정
    const updateComment = useMutation<
        void,
        ApiError,
        { commentId: number; content: string }
    >({
        mutationFn: ({ commentId, content }) =>
            updateCommentRequest({ projectId, taskId, commentId, content }),
        onSuccess: () => {
            toast.success("comment가 수정됐습니다", {
                duration: 2000,
            });
            invalidateComments();
        },
        onError: (err) => {
            toast.error(err.message || "comment 수정에 실패하였습니다");
        },
    });

    // 삭제
    const deleteComment = useMutation<void, ApiError, number>({
        mutationFn: (commentId) =>
            deleteCommentRequest({ projectId, taskId, commentId }),
        onSuccess: () => {
            toast.success("comment가 삭제됐습니다", {
                duration: 2000,
            });
            invalidateComments();
        },
        onError: (err) => {
            toast.error(err.message || "comment를 삭제하는데 실패하였습니다");
        },
    });

    return {
        comments,
        isLoading,
        isError,
        createComment,
        updateComment,
        deleteComment,
    };
}
