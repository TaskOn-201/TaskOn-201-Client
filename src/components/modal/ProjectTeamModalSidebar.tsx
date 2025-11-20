import { cn } from "@/lib/utils";
import { ProjectTeamModalTab } from "./type";

interface ProjectTeamModalSidebarProps {
  tabs: ProjectTeamModalTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export default function ProjectTeamModalSidebar({
  tabs,
  activeTabId,
  onTabChange,
}: ProjectTeamModalSidebarProps) {
  return (
    <div className="w-[30%] bg-gray1 p-4 space-y-2 overflow-y-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
            activeTabId === tab.id
              ? "bg-sub1 text-main"
              : "text-gray5 hover:bg-gray2"
          )}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
