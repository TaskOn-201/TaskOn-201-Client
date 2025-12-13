"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError, loginRequest } from "@/lib/auth/authApi";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import Oauth2Button from "./Oauth2LoginButton";
import { saveAuth } from "@/lib/auth/authStorage";

interface LoginFormProps {
    isVisible: boolean;
}

export default function LoginForm({ isVisible }: LoginFormProps) {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return (
        <div
            className={`flex items-center justify-center lg:justify-start p-6 sm:p-8 lg:pl-12 xl:pl-16 bg-white transition-all duration-700 ease-in-out absolute left-0 w-full lg:w-1/2 h-full overflow-y-auto ${
                !isVisible
                    ? "opacity-0 pointer-events-none z-0"
                    : "opacity-100 pointer-events-auto z-40"
            }`}
        >
            <div className="w-full max-w-md px-2 sm:px-4 lg:px-0">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray5 mb-2">
                        로그인
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                >
                    <Input
                        label="이메일"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />

                    <Input
                        label="비밀번호"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />

                    <Button
                        type="submit"
                        label={`${
                            loginMutation.isPending ? "Loading..." : "Sign In"
                        }`}
                        variant="primary"
                        size="md"
                        fullWidth
                        className="mt-6"
                        disabled={loginMutation.isPending}
                    />
                </form>

                <div className="mt-6 sm:mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray2"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray4">OR</span>
                        </div>
                    </div>

                    <Oauth2Button />
                </div>
            </div>
        </div>
    );
}
