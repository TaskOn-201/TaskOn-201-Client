import { JoinedProject } from "../user/userApi";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface AuthUser {
    userId: number;
    email: string;
    name: string;
    profileImageUrl: string | null;
}

export interface MeUser extends AuthUser {
  joinedProjects: JoinedProject[];
}

// 토큰과 사용자 저장
export function saveAuth(accessToken: string, user: AuthUser) {
    if (typeof window === "undefined") return null;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// 토큰 가져오기
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// 유저 정보 가져오기
export function getAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
        return JSON.parse(user) as AuthUser;
    } catch {
        return null;
    }
}

// 로그아웃 시 지우기
export function clearAuth() {
    if (typeof window === "undefined") return null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
