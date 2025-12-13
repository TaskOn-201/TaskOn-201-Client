import { redirectOAuth } from "@/lib/auth/ouath";
import Image from "next/image";
import React from "react";

const Oauth2Button = () => {

    return (
        <div className="flex gap-8 justify-center">
            <button
                type="button"
                onClick={()=> redirectOAuth("kakao")}
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
                onClick={()=> redirectOAuth("google")}
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
