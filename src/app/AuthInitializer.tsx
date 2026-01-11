"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueAccessToken } from "@/lib/auth/authFetch";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/authStorage";
import { fetchMe } from "@/lib/user/userApi";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initialize, setAuth, clearAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            initialize();

            const token = getAccessToken();
            if (token) return;

            const newToken = await reissueAccessToken();
            if (!newToken) {
                clearAuth();
                router.replace("/login");
                return;
            }

            const user = await fetchMe(newToken);
            if (!user) {
                clearAuth();
                router.replace("/login");
                return;
            }

            setAuth(newToken, user);
        };

        init();
    }, [initialize, setAuth, clearAuth, router]);

    return <>{children}</>;
}
