const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type OAuthProvider = "kakao" | "google";

export function getUrlOAuthLogin(provider: OAuthProvider) {
    return `${API_BASE_URL}/oauth2/authorization/${provider}`;
}

export function redirectOAuth(provider: OAuthProvider) {
    if (typeof window === "undefined") return;
    window.location.href = getUrlOAuthLogin(provider);
}
