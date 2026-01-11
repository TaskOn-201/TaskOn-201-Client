import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthInitializer } from "./AuthInitializer";
import { getUserByToken, reissueServerToken } from "@/lib/auth/authFetchServer";

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "TaskOn",
    description: "TaskOn 협업 프로젝트",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const newAccessToken = await reissueServerToken();

    let user = null;
    if (newAccessToken) {
        user = await getUserByToken(newAccessToken);
    }
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
                {newAccessToken && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.localStorage.setItem("accessToken", "${newAccessToken}");
                            window.localStorage.setItem("user", ${JSON.stringify(
                                JSON.stringify(user)
                            )});
                        `,
                        }}
                    />
                )}
                <ReactQueryProvider>
                    <AuthInitializer>
                        <LayoutWrapper>{children}</LayoutWrapper>
                    </AuthInitializer>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
