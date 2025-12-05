"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { saveAuth } from "@/lib/auth/authStorage";
import { useAuthStore } from "@/store/useAuthStore";

const OAuth2SuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");

        if (!accessToken) {
            toast.error("카카오 로그인 정보가 올바르지 않습니다.", {
                duration: 2000,
            });
            setTimeout(() => {
                router.replace("/login");
            }, 2500);

            return;
        }

        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error("유저 정보 조회 실패");
                }

                const body = await res.json();
                const user = body.data;

                saveAuth(accessToken, user);
                setAuth(accessToken, user);

                toast.success("카카오 로그인 완료!");
                setTimeout(() => {
                    router.replace("/");
                }, 2500);
            } catch (error) {
                console.error(error);
                toast.error("카카오 로그인 처리 중 오류가 발생했습니다.");
                setTimeout(() => {
                    router.replace("/login");
                }, 2500);
            }
        })();
    }, [searchParams, router, setAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>카카오 로그인 처리 중입니다...</p>
        </div>
    );
}

export default OAuth2SuccessPage;
