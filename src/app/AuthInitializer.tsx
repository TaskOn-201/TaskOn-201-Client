"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueAccessToken } from "@/lib/auth/authFetch";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/authStorage";
import { fetchMe } from "@/lib/user/userApi";
import { authCleanup } from "@/lib/auth/authCleanup";
import { useQueryClient } from "@tanstack/react-query";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initialize, setAuth, clearAuth } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const init = async () => {
            initialize();

            const token = getAccessToken();
            if (token) return;

            const hasRefreshToken = document.cookie.includes("refreshToken=");
            if (!hasRefreshToken) {
                return; // 로그인 안 된 상태이므로 아무것도 안 함
            }

            const newToken = await reissueAccessToken();
            if (!newToken) {
                clearAuth();
                authCleanup(queryClient);
                router.replace("/login");
                return;
            }

            const user = await fetchMe(newToken);
            if (!user) {
                clearAuth();
                authCleanup(queryClient);
                router.replace("/login");
                return;
            }

            setAuth(newToken, user);
        };

        init();
    }, [initialize, setAuth, clearAuth, router, queryClient]);

    return <>{children}</>;
}
