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
    try {
      const newToken = await reissueAccessToken();
      if (!newToken) {
        clearAuth();
        return res;
      }

      // 새 토큰으로 재요청
      res = await fetchToken(url, options, newToken);
    } catch (err) {
      clearAuth();
      throw err;
    }
  }

  // refreshToken 도 만료된 경우
  if (res.status === 403 || res.status === 440) {
    clearAuth();
  }

  return res;
}

// 토큰 재발급 API
export async function reissueAccessToken(): Promise<string | null> {
    const res = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body.data.accessToken;
}
