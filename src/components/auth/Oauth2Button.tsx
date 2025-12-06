import Image from "next/image";
import React from "react";

const Oauth2Button = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleKakaoLogin = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="flex gap-8 justify-center">
            <button
                type="button"
                onClick={handleKakaoLogin}
                className="mt-6 max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
                <Image
                    src="/kakao-icon.webp"
                    alt="카카오 로그인"
                    width={40}
                    height={90}
                    priority
                />
            </button>
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-6 max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
                <Image
                    src="/web_light_rd_na@1x.png"
                    alt="구글 로그인"
                    width={40}
                    height={90}
                    priority
                />
            </button>
        </div>
    );
};

export default Oauth2Button;
