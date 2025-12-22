import {
    AuthUser,
    getAccessToken,
    getAuthUser,
    saveAuth,
    clearAuth as clearAuthStorage,
} from "@/lib/auth/authStorage";
import { create } from "zustand";

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    initialize: () => void; // 시작 시 storage에 로그인 정보 있는지 세팅
    setAuth: (token: string, user: AuthUser) => void; // 성공 시 토큰과 유저 저장
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // set 상태 변경

    // 상태
    user: null,
    accessToken: null,
    isAuthenticated: false,

    // 동작
    initialize: () => {
        const storedUser = getAuthUser();
        const storedToken = getAccessToken();

        set({
            user: storedUser,
            accessToken: storedToken,
            isAuthenticated: !!(storedUser && storedToken),
        });
    },
    setAuth: (token, user) => {
        saveAuth(token, user);

        set({
            user,
            accessToken: token,
            isAuthenticated: true,
        });
    },
    clearAuth: () => {
        clearAuthStorage();
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        });
    },
}));
