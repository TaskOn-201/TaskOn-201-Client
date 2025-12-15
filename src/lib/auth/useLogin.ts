"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, loginRequest } from "./authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLogin() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
        const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            const { accessToken, user } = data.data;

            setAuth(accessToken, user);
            queryClient.setQueryData(["me"], user);
            router.replace("/");
            router.refresh();
        },
        onError: (error: ApiError) => {
            const status = error.status;

            if (status === 400) {
                toast.error("잘못된 요청입니다");
            } else if (status === 401) {
                toast.error("이메일 또는 비밀번호가 일치하지 않습니다");
            } else if (status === 500) {
                toast.error("네트워크 오류가 발생했습니다");
            } else {
                toast.error(error.message || "로그인 중 오류가 발생했습니다.");
            }
        },
    });
}
