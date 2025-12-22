import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요 없는 공개 페이지
const PUBLIC_PATHS = ["/", "/login", "/signup","/oauth2/success"];

export function middleware(request: NextRequest) {

  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isAuthenticated = !!refreshToken;

  // 1. 인증이 필요한 페이지인데 토큰이 없으면 → 로그인으로
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시 → board로
  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    const projectsUrl = new URL("/board", request.url);
    return NextResponse.redirect(projectsUrl);
  }

  return NextResponse.next();
}

export const config = {
  // 정적 파일, API, _next 제외
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
