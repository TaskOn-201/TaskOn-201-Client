"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectRequest } from "@/lib/project/projectApi";
import { ArrowLeft, FolderPlus } from "lucide-react";

export default function ProjectCreateForm() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("프로젝트 이름을 입력해주세요.");
      return;
    }

    setIsCreating(true);
    try {
      await createProjectRequest({
        projectName: projectName.trim(),
        projectDescription: projectDescription.trim() || undefined,
      });
      router.push("/board");
    } catch (err) {
      console.error("프로젝트 생성 실패:", err);
      setError("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray4 hover:text-main mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">뒤로가기</span>
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray2 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-main rounded-xl flex items-center justify-center">
              <FolderPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-main2">새 프로젝트 생성</h1>
              <p className="text-sm text-gray4">프로젝트 정보를 입력해주세요</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-gray5 mb-2"
              >
                프로젝트 이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray2 rounded-lg focus:outline-none focus:border-main transition-colors"
                maxLength={50}
              />
            </div>
            <div>
              <label
                htmlFor="projectDescription"
                className="block text-sm font-medium text-gray5 mb-2"
              >
                프로젝트 설명
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="프로젝트에 대한 설명을 입력하세요 (선택)"
                rows={4}
                className="w-full px-4 py-3 border border-gray2 rounded-lg focus:outline-none focus:border-main transition-colors resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray3 mt-1 text-right">
                {projectDescription.length}/200
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray2 text-gray4 rounded-lg hover:bg-gray1 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isCreating || !projectName.trim()}
                className="flex-1 py-3 bg-main text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "생성 중..." : "프로젝트 생성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
