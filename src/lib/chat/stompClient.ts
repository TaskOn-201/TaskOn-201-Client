"use client";

import { Client, IFrame } from "@stomp/stompjs";
import { API_BASE_URL } from "../auth/authApi";

function getApiBaseUrl() {
    const url = API_BASE_URL;
    if (!url)
        throw new Error("API_BASE_URL is undefined, env 설정을 확인하세요");
    return url;
}

function toWsBaseUrl(httpBaseUrl: string) {
    return httpBaseUrl.replace(/^http/, "ws");
}
export function createStompClient(options: {
    accessToken: string | null;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onStompError?: (frame: IFrame) => void;
}) {
    const WS_BASE_URL = toWsBaseUrl(getApiBaseUrl());
    const WS_ENDPOINT = `${WS_BASE_URL}/ws/chat`;

    let disconnectNotified = false;
    const notifyDisconnectOnce = () => {
        if (disconnectNotified) return;
        disconnectNotified = true;
        options.onDisconnect?.();
    };

    const client = new Client({
        webSocketFactory: () => new WebSocket(WS_ENDPOINT),
        connectHeaders: options.accessToken
            ? { Authorization: `Bearer ${options.accessToken}` }
            : {},

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            disconnectNotified = false;
            options.onConnect?.();
        },

        onDisconnect: () => notifyDisconnectOnce(),

        onStompError: (frame) => options.onStompError?.(frame),

        onWebSocketClose: () => notifyDisconnectOnce(),
    });

    return client;
}
