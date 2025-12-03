import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthInitializer } from "./AuthInitializer";

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "TaskOn",
    description: "TaskOn 협업 프로젝트",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <link
                    rel="stylesheet"
                    as="style"
                    crossOrigin="anonymous"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                />
            </head>
            <body className={`${openSans.variable} antialiased `}>
                <ReactQueryProvider>
                    <AuthInitializer>
                        <LayoutWrapper>{children}</LayoutWrapper>
                    </AuthInitializer>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
