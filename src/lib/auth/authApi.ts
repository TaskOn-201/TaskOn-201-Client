import { authFetch } from "./authFetch";
import { AuthUser, getAccessToken } from "./authStorage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        user: AuthUser;
        loggedIn: boolean;
    };
}

interface LoginPayload {
    email: string;
    password: string;
}

interface SignupResponse {
    statusCode: number;
    message: string;
    data: AuthUser;
}

interface SignupPayload {
    email: string;
    name: string;
    password: string;
    passwordCheck: string;
}

export class ApiError extends Error {
    status?: number;
    data?: string;
    code?: number;
}

interface deleteResponse {
    statusCode: number;
    message: string;
    data: null;
}

export async function loginRequest({
    email,
    password,
}: LoginPayload): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    const body = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "로그인 실패");
        error.status = res.status;
        throw error;
    }

    return body as LoginResponse;
}

export async function signupRequest({
    email,
    name,
    password,
    passwordCheck,
}: SignupPayload): Promise<SignupResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            passwordCheck,
        }),
    });

    const body = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "회원가입 실패");
        error.status = res.status;
        error.data = body.data;
        throw error;
    }

    return body as SignupResponse;
}

export async function checkEmailRequest(email: string) {
    const res = await fetch(
        `${API_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(
            email
        )}`
    );

    const body = await res.json();

    if (!res.ok) {
        const error = new ApiError(body.message || "이메일 중복 확인 실패");
        error.status = res.status;
        throw error;
    }

    return body;
}

export async function logoutRequest() {
    const token = getAccessToken();

    return fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
    });
}

export async function userDeleteRequest() {
    const res = await authFetch("/api/users/me", { method: "DELETE" });

    const body: deleteResponse = await res.json();

    if (!res.ok || body.statusCode !== 200) {
        const error = new ApiError(body?.message ?? "회원 탈퇴 실패");
        error.status = res.status;
        throw error;
    }

    return body;
}
