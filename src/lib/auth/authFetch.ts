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
    return await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
    });
}

// 토큰 재발급 확인 후 재발급한 토큰 부여
export async function authFetch(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    let res = await fetchToken(url, options, token);

    if (res.status !== 401) {
        return res;
    }

    // 401 이면 재발급
    try {
        const newToken = await reissueAccessToken();

        res = await fetchToken(url, options, newToken);
        return res;
    } catch (err) {
        clearAuth();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw err;
    }
}

interface ReissueResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
    };
}

// 토큰 재발급 API
export async function reissueAccessToken(): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
        method: "POST",
        credentials: "include",
    });

    if (res.status === 401) {
        clearAuth();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new Error("리프레시 토큰 만료");
    }

    const body: ReissueResponse = await res.json();

    if (!res.ok) {
        throw new Error("토큰 재발급 실패");
    }

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
