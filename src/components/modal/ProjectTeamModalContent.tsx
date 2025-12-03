import { X } from "lucide-react";
import { ProjectTeamModalTab } from "./type";

interface ProjectTeamModalContentProps {
  title: string;
  activeTab?: ProjectTeamModalTab;
  onClose: () => void;
}

export default function ProjectTeamModalContent({
  title,
  activeTab,
  onClose,
}: ProjectTeamModalContentProps) {
  return (
    <div className="w-[70%] bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-6">
        <h2 id="modal-title" className="text-lg font-semibold text-gray5">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray4 hover:text-gray5 hover:bg-gray2 transition-colors rounded-full p-1.5"
          aria-label="모달 닫기"
        >
          <X size={20} />
        </button>
      </div>

      {/* 컨텐츠 - 스크롤 영역 */}
      <div className="p-6 overflow-y-auto flex-1">{activeTab?.content}</div>

      {/* 푸터 - 고정 */}
      {activeTab?.footer && (
        <div className="px-6 py-4 border-t border-gray2">
          {activeTab.footer}
        </div>
      )}
    </div>
  );
}
