"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Profile from "./Profile";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { logoutRequest } from "@/lib/auth/authApi";
import { toast } from "sonner";
import useMe from "@/lib/user/useMe";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderProps {
    className?: string;
}

const Header = ({ className }: HeaderProps) => {
    const { clearAuth } = useAuthStore();
    const { data: me } = useMe();
    const router = useRouter();
    const queryClient = useQueryClient();

    const logoutHandler = async () => {
        try {
            await logoutRequest();
        } catch (err) {
            console.error(err);
            toast.error("로그아웃 중 오류가 발생했습니다.");
        } finally {
            clearAuth();
            queryClient.setQueryData(["me"], null);
            queryClient.removeQueries({ queryKey: ["me"], exact: false });

            router.replace("/");
            router.refresh();
        }
    };

    const isLoggedIn = !!me;

    return (
        <header
            className={cn(
                "w-full h-20 flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-white",
                className
            )}
        >
            <div className="cursor-pointer">
                <Image
                    src="/logo.png"
                    alt="TaskOn logo"
                    width={130}
                    height={50}
                />
            </div>
            <div className="w-fit">
                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex gap-3 py-2 cursor-pointer items-center">
                            {/* 사용자 프로필 */}
                            {me.profileImageUrl !== null ? (
                                <Profile
                                    size="sm"
                                    imageUrl={me.profileImageUrl}
                                />
                            ) : (
                                <Profile size="sm" />
                            )}
                            <span className="flex flex-col justify-center text-main2">
                                {me.name}
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-6" align="center">
                            <DropdownMenuItem>
                                <Link href={"/mypage"}>MyPage</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="pl-1.5 cursor-pointer"
                                onClick={logoutHandler}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href={"/login"}>
                        <Button
                            label="로그인"
                            variant="white"
                            className="px-4 text-lg font-bold"
                        />
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
