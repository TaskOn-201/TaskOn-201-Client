"use client"

import { Client, IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../auth/authApi";

interface CreateClientOptions {
    accessToken: string | null;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onStompError?: (frame: IFrame) => void;
}

export function createStompClient(options: CreateClientOptions) {
    let disconnectNotified = false;
    const notifyDisconnectOnce = () => {
        if (disconnectNotified) return;
        disconnectNotified = true;
        options.onDisconnect?.();
    };

    const client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws/chat`),
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

        onDisconnect: () => {
            notifyDisconnectOnce();
        },

        onStompError: (frame) => {
            console.log("STOMP ERROR", {
                command: frame.command,
                headers: frame.headers,
                body: frame.body,
            });

            // 외부 핸들러 호출되게
            options.onStompError?.(frame);
        },

        onWebSocketClose: (evt) => {
            console.error("WS CLOSE", {
                code: evt.code,
                reason: evt.reason,
                wasClean: evt.wasClean,
            });

            // STOMP disconnect 없이 닫히는 경우에도 state 정리
            notifyDisconnectOnce();
        },

        onWebSocketError: (evt) => {
            console.error("WS ERROR", evt);
        },

        debug: (debug) => console.log(debug),
    });

    return client;
}
