import { ApiError } from "../auth/authApi";
import { authFetch } from "../auth/authFetch";
import { getAccessToken, MeUser } from "../auth/authStorage";

interface ProfileUpdatePayload {
    name?: string;
    profileImageUrl?: File | null;
}

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

export interface JoinedProject {
    projectId: number;
    projectName: string;
}

export interface UserInfoResponse {
    statusCode: number;
    message: string;
    data: UserInfoData;
}

export interface UserInfoData {
    userId: number;
    email: string;
    name: string;
    profileImageUrl: string | null;
    joinedProjects: JoinedProject[];
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
        const error = new ApiError(
            body.message || "비밀번호 변경에 실패했습니다"
        );
        error.status = res.status;
        throw error;
    }
}

export async function profileUpdateRequest({
    name,
    profileImageUrl,
}: ProfileUpdatePayload) {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (profileImageUrl) formData.append("profileImage", profileImageUrl);

    const res = await authFetch("/api/users/me", {
        method: "PATCH",
        body: formData,
    });

    if (!res.ok) {
        const body = await res.json();
        throw new ApiError(body.message);
    }

    return (await res.json()).data;
}

export async function fetchMe(): Promise<UserInfoResponse["data"] | null> {
    const token = getAccessToken();

    if (!token) {
        return null;
    }

    const res = await authFetch("/api/users/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });

    if (res.status === 401) {
        return null;
    }

    const body: UserInfoResponse = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "유저 정보 조회 실패");
    }

    return body.data as MeUser;
}
