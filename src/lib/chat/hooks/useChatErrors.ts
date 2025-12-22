"use client";

import { useEffect } from "react";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { toast } from "sonner";

export interface StompErrorResponse {
    code?: string;
    message?: string;
    roomId?: number;
    action?: string;
    severity?: "toast" | "modal" | "alert";
};

// 에러 옵션
type UseChatErrorsOptions = {
    onError?: (err: StompErrorResponse) => void;
};

export function useChatErrors(
    clientRef: React.RefObject<Client | null>,
    connected: boolean,
    options?: UseChatErrorsOptions
) {
    useEffect(() => {
        if (!clientRef.current || !connected) return;

        const sub: StompSubscription = clientRef.current.subscribe(
            "/user/queue/errors",
            (frame: IMessage) => {
                try {
                    const err: StompErrorResponse = JSON.parse(frame.body);

                    console.error("STOMP ERROR", err);

                    const msg = err?.message ?? "알 수 없는 오류가 발생했습니다";
                    toast.error(msg);

                    options?.onError?.(err);
                } catch (e) {
                    console.error("STOMP ERROR PARSE FAIL:", e);
                    toast.error("알 수 없는 오류가 발생했습니다");
                }
            }
        );

        return () => {
            sub.unsubscribe();
        };
    }, [clientRef, connected, options]);
}
