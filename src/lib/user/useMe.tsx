"use client"

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "./userApi";

const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 1000 * 60, // 데이터 최신 유지 시간
    retry: false, // 재시도
  });
};

export default useMe;
