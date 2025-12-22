"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "./ui/sonner";

// Sidebar/Header가 없는 페이지 (인증 체크는 middleware.ts에서 처리)
const NO_LAYOUT_PATHS = ["/", "/login", "/signup", "/projects", "/oauth2/success"];
const NO_SCROLL_LAYOUT_PATHS = ["/inbox"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNoLayoutPage = NO_LAYOUT_PATHS.includes(pathname);

  if (isNoLayoutPage) {
    return <>{children}</>;
  }

  const isNoScrollLayoutPage = NO_SCROLL_LAYOUT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={`w-full flex flex-col min-h-0 ${isNoScrollLayoutPage ? "overflow-hidden" : "overflow-y-auto"}`}>
        <Header />
        {children}
        <Toaster richColors position="top-center" duration={1000} />
      </div>
    </div>
  );
}
