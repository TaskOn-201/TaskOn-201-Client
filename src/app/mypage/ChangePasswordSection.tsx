"use client";

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
import { useState } from "react";

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"confirm" | "error" | "success">(
    "confirm"
  );

  const handleChangePasswordClick = () => {
    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      setDialogType("error");
      setIsDialogOpen(true);
      return;
    }

    // 확인 다이얼로그 표시
    setDialogType("confirm");
    setIsDialogOpen(true);
  };

  const handleConfirmChange = () => {
    // 비밀번호 변경 로직
    console.log("Password changed");
    setIsDialogOpen(false);

    // 성공 메시지 표시
    setDialogType("success");
    setTimeout(() => setIsDialogOpen(true), 100);
  };

  // 모든 필드가 입력되었는지 확인
  const isFormValid =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold mb-6">Change Password</h3>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current password
          </label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your password"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            fullWidth
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            label="Change password"
            variant={isFormValid ? "primary" : "disable"}
            size="md"
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
              {dialogType === "error"
                ? "비밀번호 불일치"
                : dialogType === "success"
                ? "비밀번호 변경 완료"
                : "비밀번호 변경"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogType === "error"
                ? "새 비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                : dialogType === "success"
                ? "비밀번호가 성공적으로 변경되었습니다."
                : "비밀번호를 변경하시겠습니까?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {dialogType === "confirm" ? (
              <>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmChange}
                  className="bg-main hover:bg-main/80 text-white"
                >
                  변경
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction
                onClick={() => setIsDialogOpen(false)}
                className="bg-main hover:bg-main/80 text-white"
              >
                확인
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
