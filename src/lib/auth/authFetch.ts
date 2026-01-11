import {
    clearAuth,
    getAccessToken,
    getAuthUser,
    saveAuth,
} from "./authStorage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API Token 저장하는 Fetch 함수
async function fetchToken(
    url: string,
    options: RequestInit,
    token: string | null
) {
    // FormData 인지 확인
    const isFormData = options.body instanceof FormData;

    // Headers 내장 클래스 사용
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    // FormData 가 없고 Content-Type 없으면 application/json 으로 고정
    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    return await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
    });
}

// 토큰 재발급 확인 후 재발급한 토큰 부여
export async function authFetch(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    let res = await fetchToken(url, options, token);

    if (res.status === 401) {
        const newToken = await reissueAccessToken();

        // newToken null 이면 만료로 판단하여 accessToken, user 삭제
        if (!newToken) {
            console.warn("refreshToken 만료, 로그인 페이지로 이동");
            clearAuth();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return res;
        }

        // 재발급 성공 시 새 토큰으로 다시 요청
        res = await fetchToken(url, options, newToken);
    }

    return res;
}

interface ReissueResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
    };
}

// 토큰 재발급 API
export async function reissueAccessToken(): Promise<string | null> {
    const res = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
        method: "POST",
        credentials: "include",
    });

    // refreshToken 만료
    if (res.status === 403 || res.status === 440) {
        console.warn("refreshToken 만료");
        clearAuth();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    // 성공 시
    if (res.ok) {
        const body: ReissueResponse = await res.json();
        const newAccessToken = body.data.accessToken;
        const user = getAuthUser();
        if (user) {
            saveAuth(newAccessToken, user);
        } else {
            saveAuth(newAccessToken, {
                userId: 0,
                email: "",
                name: "",
                profileImageUrl: null,
            });
        }
        return newAccessToken;
    }

    console.warn("reissueAccessToken 실패:", res.status);
    return null;
}