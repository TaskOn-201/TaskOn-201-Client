import { cookies } from "next/headers";
import { API_BASE_URL } from "./authApi";

// 서버용 재발급 토큰 -> 렌더링 시 refreshToken 이 있으면 accessToken 재발급
export async function reissueServerToken(): Promise<string | null> {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refreshToken");
    console.log("SSR refreshToken:", refreshToken?.value);
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
            method: "POST",
            credentials: "include",
            cache: "no-store",
        });

        console.log("SSR reissue response status:", res.status);

        if (!res.ok) return null;

        const body = await res.json();
        console.log("SSR reissue response body:", body);
        return body.data.accessToken;
    } catch (err) {
        console.error("reissueServerToken Error:", err);
        return null;
    }
}

// accessToken 으로 유저 정보 조회
export async function getUserByToken(accessToken: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return null;
        const body = await res.json();
        return body.data;
    } catch (err) {
        console.error("getUserByToken Error:", err);
        return null;
    }
}
