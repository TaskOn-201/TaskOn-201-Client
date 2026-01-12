"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueAccessToken } from "@/lib/auth/authFetch";
import { getAccessToken } from "@/lib/auth/authStorage";
import { fetchMe } from "@/lib/user/userApi";


export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initialize, setAuth } = useAuthStore();

    useEffect(() => {
        const init = async () => {
            initialize();

            const token = getAccessToken();
            if (token) return;

            const newToken = await reissueAccessToken();
            if (!newToken) {
                return;
            }

            const user = await fetchMe(newToken);
            if (!user) {
                return;
            }

            setAuth(newToken, user);
        };

        init();
    }, [initialize, setAuth]);

    return <>{children}</>;
}
