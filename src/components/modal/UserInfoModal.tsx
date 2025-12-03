"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserInfoModalProps } from "./type";
import BaseModal from "./BaseModal";

const sizeClasses = {
    sm: "max-w-md min-h-[300px]",
    md: "max-w-lg min-h-[400px]",
    lg: "max-w-2xl min-h-[500px]",
};

export default function UserInfoModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "sm",
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    className,
    titleNode,
}: UserInfoModalProps) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={closeOnOverlayClick}
            closeOnEsc={closeOnEsc}
            className={cn(sizeClasses[size], className)}
        >
            {/* 헤더 */}
            {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-6">
                    {title && (
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold text-gray5"
                        >
                            {title}
                        </h2>
                    )}
                    {titleNode && titleNode}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="ml-auto text-gray4 hover:text-gray5 hover:bg-gray2 transition-colors rounded-full p-1.5"
                            aria-label="모달 닫기"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            )}

            {/* 본문 */}
            <div className={cn(titleNode ? "pt-2 pb-6" : "py-6", "px-6 overflow-y-auto")}>{children}</div>

            {/* 푸터 */}
            {footer && (
                <div className="px-6 py-4 border-t border-gray2 bg-gray1/30">
                    {footer}
                </div>
            )}
        </BaseModal>
    );
}
