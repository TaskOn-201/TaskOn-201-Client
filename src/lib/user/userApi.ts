import { ApiError } from "../auth/authApi";
import { authFetch } from "../auth/authFetch";

interface PasswordChangeResponse {
    statusCode: number;
    message: string;
    data: null;
}

interface PasswordChangePayload {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export async function passwordChangeRequest({
    currentPassword,
    newPassword,
    newPasswordConfirm,
}: PasswordChangePayload): Promise<void> {
    const res = await authFetch("/api/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({
            currentPassword,
            newPassword,
            newPasswordConfirm,
        }),
    });
    const body: PasswordChangeResponse = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "비밀번호 변경에 실패했습니다");
        error.status = res.status;
        throw error;
    }
}
