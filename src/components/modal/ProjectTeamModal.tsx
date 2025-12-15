"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProjectTeamModalProps } from "./type";
import ProjectTeamModalSidebar from "./ProjectTeamModalSidebar";
import ProjectTeamModalContent from "./ProjectTeamModalContent";
import BaseModal from "./BaseModal";

export default function ProjectTeamModal({
  isOpen,
  onClose,
  title,
  tabs,
  defaultTabId,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
}: ProjectTeamModalProps) {
  const [activeTabId, setActiveTabId] = useState(
    defaultTabId || tabs[0]?.id || ""
  );

  // 모달이 열릴 때마다 defaultTabId로 리셋
  useEffect(() => {
    if (isOpen) {
      setActiveTabId(defaultTabId || tabs[0]?.id || "");
    }
  }, [isOpen, defaultTabId, tabs]);

  // 활성 탭 찾기
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
      className={cn("max-w-4xl", className)}
    >
      <div className="flex h-[600px]">
        <ProjectTeamModalSidebar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />
        <ProjectTeamModalContent
          title={title}
          activeTab={activeTab}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}
