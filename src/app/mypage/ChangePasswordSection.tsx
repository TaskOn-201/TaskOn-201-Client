"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiError } from "@/lib/auth/authApi";
import { passwordChangeRequest } from "@/lib/user/userApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ChangePasswordSection() {
    const router = useRouter();
    const { clearAuth } = useAuthStore();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<
        "confirm" | "error" | "error-current" | "success"
    >("confirm");

    const passwordChangeMutation = useMutation({
        mutationFn: passwordChangeRequest,
        onSuccess: () => {
            setDialogType("success");
            setIsDialogOpen(true);
        },
        onError: (error: ApiError) => {
            const status = error.status;
            if (status === 401) {
                setDialogType("error-current");
                setIsDialogOpen(true);
            } else if (status === 400) {
                setDialogType("error");
                setIsDialogOpen(true);
            } else {
                toast.error(
                    error.message || "비밀번호 변경 중 오류가 발생했습니다."
                );
            }
        },
    });

    const handleChangePasswordClick = () => {
        // 비밀번호 일치 확인
        if (newPassword !== confirmPassword) {
            setDialogType("error");
            setIsDialogOpen(true);
            return;
        }
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{14,}$/;
        if (
            !passwordPattern.test(newPassword) ||
            !passwordPattern.test(confirmPassword)
        ) {
            toast.error(
                "비밀번호는 14자 이상이며, 대문자/특수문자를 각각 필수로 1개 이상 포함해야 합니다",
                { duration: 2000 }
            );
            return;
        }

        setDialogType("confirm");
        setIsDialogOpen(true);
    };

    const handleConfirmChange = () => {
        if (passwordChangeMutation.isPending) return;

        // api 호출
        passwordChangeMutation.mutate({
            currentPassword,
            newPassword,
            newPasswordConfirm: confirmPassword,
        });
    };

    const handleSuccessConfirm = () => {
        setIsDialogOpen(false);
        clearAuth();
        router.replace("/login");
    };

    // 모든 필드가 입력되었는지 확인
    const isFormValid =
        currentPassword.trim() !== "" &&
        newPassword.trim() !== "" &&
        confirmPassword.trim() !== "";

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6">비밀번호 변경</h3>

            <div className="max-w-2xl mx-auto space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 사용 중인 비밀번호를 입력하세요"
                        fullWidth
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요(14자, 대문자 1개 이상 + 특수문자 1개 이상 포함)"
                        fullWidth
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password Confirm
                    </label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력하세요"
                        fullWidth
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        label="Password change"
                        variant={isFormValid ? "primary" : "disable"}
                        size="sm"
                        className="px-4 py-2"
                        onClick={handleChangePasswordClick}
                        disabled={!isFormValid}
                    />
                </div>
            </div>

            {/* 비밀번호 변경 확인 다이얼로그 */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dialogType === "error-current"
                                ? "비밀번호 불일치"
                                : dialogType == "error"
                                ? "새 비밀번호 불일치"
                                : dialogType === "success"
                                ? "비밀번호 변경 완료"
                                : "비밀번호 변경"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogType === "error-current"
                                ? "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                                : dialogType == "error"
                                ? "새 비밀번호와 확인 비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                                : dialogType === "success"
                                ? "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요."
                                : "비밀번호를 변경하시겠습니까?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {dialogType === "confirm" ? (
                            <>
                                <AlertDialogCancel
                                    className="cursor-pointer"
                                    disabled={passwordChangeMutation.isPending}
                                >
                                    취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmChange}
                                    className="bg-main hover:bg-main/80 text-white cursor-pointer"
                                    disabled={passwordChangeMutation.isPending}
                                >
                                    {passwordChangeMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            변경 중...
                                        </>
                                    ) : (
                                        "변경하기"
                                    )}
                                </AlertDialogAction>
                            </>
                        ) : dialogType === "error-current" ||
                          dialogType === "error" ? (
                            <AlertDialogAction
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-main hover:bg-main/80 text-white cursor-pointer"
                            >
                                확인
                            </AlertDialogAction>
                        ) : dialogType === "success" ? (
                            <AlertDialogAction
                                onClick={handleSuccessConfirm}
                                className="bg-main hover:bg-main/80 text-white cursor-pointer"
                            >
                                확인
                            </AlertDialogAction>
                        ) : null}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
