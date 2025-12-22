import { QueryClient } from "@tanstack/react-query";


// 로그아웃, 탈퇴 시 사용
export function authCleanup(queryClient: QueryClient) {
  localStorage.removeItem("accessToken");

  queryClient.setQueryData(["me"], null);
  queryClient.removeQueries({ queryKey: ["me"], exact: false });
  queryClient.clear();
}