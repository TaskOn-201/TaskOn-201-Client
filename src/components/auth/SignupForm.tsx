"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ApiError, checkEmailRequest, signupRequest } from "@/lib/auth/authApi";

interface SignupFormProps {
    isVisible: boolean;
}

export default function SignupForm({ isVisible }: SignupFormProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEmailCheck, setIsEmailCheck] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const signupMutation = useMutation({
        mutationFn: signupRequest,
        onSuccess: () => {
            toast.success("회원가입이 완료됐습니다, 로그인을 해주세요");
            setTimeout(() => {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }, 1500);
        },
        onError: (error: ApiError) => {
            const status = error.status;
            if (status === 400) {
                toast.error(
                    error.data ||
                        error.message ||
                        "입력값 검증에 실패했습니다. 정보를 다시 확인해주세요."
                );
            } else {
                toast.error("회원가입에 실패하였습니다");
            }
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{14,}$/;
        if (!isEmailCheck) {
            toast.error("이메일 중복 확인 후 진행해주세요");
            return;
        }
        if (!passwordPattern.test(password)) {
            toast.error(
                "비밀번호는 14자 이상이며, 대문자/특수문자를 각각 필수로 1개 이상 포함해야 합니다"
            );
            return;
        }

        signupMutation.mutate({ name, email, password, passwordCheck });
    };

    const handleKakaoLogin = () => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
    };

    const emailCheckMutation = useMutation({
        mutationFn: checkEmailRequest,
        onSuccess: () => {
            toast.success("사용 가능한 이메일입니다");
            setIsEmailCheck(true);
        },
        onError: (error: ApiError) => {
            const status = error.status;
            if (status === 400) {
                toast.error(error.message || "오류가 발생했습니다.");
                setIsEmailCheck(false);
            } else {
                toast.error("네트워크 오류가 발생했습니다");
            }
        },
    });

    const handleEmailCheck = async () => {
        const emailPattern =
            /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
        setIsEmailCheck(false);

        if (!email) {
            toast.error("이메일을 입력해주세요");
            return;
        }
        if (emailPattern.test(email) === false) {
            toast.info("이메일 양식에 맞게 입력해주세요");
            return;
        }

        emailCheckMutation.mutate(email);
    };

    return (
        <>
            <div
                className={`flex items-center justify-center lg:justify-end p-6 sm:p-8 lg:pr-12 xl:pr-16 bg-white transition-all duration-700 ease-in-out absolute right-0 w-full lg:w-1/2 h-full overflow-y-auto ${
                    !isVisible
                        ? "opacity-0 pointer-events-none z-0"
                        : "opacity-100 pointer-events-auto z-40"
                }`}
            >
                <div className="w-full max-w-md px-2 sm:px-4 lg:px-0 py-4 sm:py-8">
                    <div className="pt-12 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray5 mb-2">
                            회원가입
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3 sm:space-y-4"
                    >
                        <div className="flex gap-2 items-center">
                            <div className="flex-1">
                                <Input
                                    label="이메일"
                                    type="text"
                                    placeholder="이메일을 입력하세요"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsEmailCheck(false);
                                    }}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="pt-6">
                                <Button
                                    type="button"
                                    label={
                                        emailCheckMutation.isPending
                                            ? "확인 중"
                                            : "중복 확인"
                                    }
                                    variant="primary"
                                    size="sm"
                                    onClick={handleEmailCheck}
                                    className="whitespace-nowrap"
                                    disabled={emailCheckMutation.isPending}
                                />
                            </div>
                        </div>
                        <Input
                            label="이름"
                            type="text"
                            placeholder="이름을 입력하세요(한글 또는 영어로만 구성된 2~15자)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />

                        <Input
                            label="비밀번호"
                            type="password"
                            placeholder="비밀번호를 입력하세요(14자, 대문자 1개 이상 + 특수문자 1개 이상 포함)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />

                        <Input
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            fullWidth
                            required
                            error={
                                passwordCheck && password !== passwordCheck
                                    ? "비밀번호가 일치하지 않습니다"
                                    : undefined
                            }
                        />

                        <div className="flex items-start gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) =>
                                    setAgreedToTerms(e.target.checked)
                                }
                                className="mt-1 w-4 h-4 text-main bg-gray-100 border-gray-300 rounded focus:ring-main focus:ring-2"
                                required
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm text-gray4"
                            >
                                By signing up, I agree with{" "}
                                <span className="text-main font-medium cursor-pointer hover:underline">
                                    Terms of Use
                                </span>{" "}
                                &{" "}
                                <span className="text-main font-medium cursor-pointer hover:underline">
                                    Privacy Policy
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            label="Sign up"
                            variant="primary"
                            size="md"
                            fullWidth
                            className="mt-6"
                            disabled={!agreedToTerms || !name || !password}
                        />
                    </form>

                    <div className="mt-4 sm:mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray2"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray4">
                                    OR
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleKakaoLogin}
                                className="mt-6 max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                <Image
                                    src="/kakao_login_large_wide.png"
                                    alt="카카오 로그인"
                                    width={300}
                                    height={90}
                                    className="w-full h-auto"
                                    priority
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
