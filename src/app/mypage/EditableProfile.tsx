"use client";

import { useEffect, useRef, useState } from "react";
import Profile from "../../components/Profile";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ProfileSize = "sm" | "md" | "lg";

interface EditableProfileProps {
    currentImageUrl?: string | null;
    userName?: string;
    fallbackText?: string;
    size?: ProfileSize;
    className?: string;
    onFileChange?: (file: File | null) => void;
}

export default function EditableProfile({
    currentImageUrl,
    userName,
    fallbackText,
    size = "lg",
    className,
    onFileChange,
}: EditableProfileProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 용

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // 메모리 점유 정리
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleClickProfile = () => {
        fileInputRef.current?.click();
    };

    const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreviewUrl(null);
            onFileChange?.(null);
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("JPEG, JPG, PNG, WEBP 형식만 업로드 가능합니다", {
                duration: 2000,
            });
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error(
                "파일 크기가 5MB를 초과했습니다, 다른 이미지로 업로드 해주세요",
                { duration: 2000 }
            );
            e.target.value = ""; // 같은 이미지를 또 등록해도 메세지 출력되게
            return;
        }

        const url = URL.createObjectURL(file);

        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
        });

        onFileChange?.(file);
        if (previewUrl) {
            toast.info("저장을 누르셔야 프로필 이미지와 이름이 변경됩니다", {
                duration: 2500,
            });
        }
    };

    const displayImageUrl = previewUrl || currentImageUrl || undefined;

    return (
        <div className="flex flex-col items-center gap-2 mt-2">
            <input
                ref={fileInputRef}
                type="file"
                accept=".jpeg,.jpg,.png,.webp"
                className="hidden"
                onChange={handleChangeFile}
            />

            <button
                type="button"
                onClick={handleClickProfile}
                className="relative rounded-full cursor-pointer"
            >
                <Plus className="absolute top-[calc(50%-12px)] left-[calc(50%-12px)] z-10 text-gray-500" />
                <Profile
                    imageUrl={displayImageUrl}
                    userName={userName}
                    fallbackText={fallbackText}
                    size={size}
                    className={cn(className, "opacity-50 w-32 h-32")}
                />
            </button>
            <span className="text-[12px] text-gray3">
                jpg, jpeg, png, webp 확장자만 가능, 최대 5MB
            </span>
        </div>
    );
}
