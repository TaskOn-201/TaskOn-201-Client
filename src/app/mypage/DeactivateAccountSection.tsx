"use client";

import Button from "@/components/Button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { userDeleteRequest } from "@/lib/auth/authApi";
import { authCleanup } from "@/lib/auth/authCleanup";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DeactivateAccountSection() {
    const queryClient = useQueryClient();

    const { clearAuth } = useAuthStore();

    const handleDeactivateAccount = async () => {
        // 계정 비활성화 로직
        try {
            await userDeleteRequest();
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "계정 비활성화에 실패하였습니다"
            );
            return;
        }
        authCleanup(queryClient);
        clearAuth();

        window.location.replace("/login");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-2">회원탈퇴</h3>
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-600">
                    더 이상 저희 서비스를 이용하지 않으시겠습니까?
                </p>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            label="Deactivate account"
                            variant="danger"
                            size="md"
                        />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                정말로 계정을 비활성화하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                이 작업은 되돌릴 수 없습니다. 계정을
                                비활성화하면 모든 데이터가 삭제되며 복구할 수
                                없습니다.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeactivateAccount}
                                className="bg-sub2 hover:bg-sub2/80 text-white"
                            >
                                계정 비활성화
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
