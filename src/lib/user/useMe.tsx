"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "../auth/authStorage";
import { authFetch } from "../auth/authFetch";

const useMe = () => {
    const token = getAccessToken();

    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await authFetch("/api/users/me");
            if (!res.ok) throw new Error("me fetch 오류");

            const json = await res.json();
            return json.data;
        },
        enabled: !!token,
        staleTime: 1000 * 60,
        retry: false,
    });
};

export default useMe;
