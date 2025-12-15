"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import BacklogTaskRow, { BacklogTaskData } from "./BacklogTaskRow";

interface BacklogSectionProps {
  title: string;
  tasks: BacklogTaskData[];
  defaultExpanded?: boolean;
  onAddTask?: () => void;
  onUpdate?: () => void;
}

const BacklogSection = ({
  title,
  tasks,
  defaultExpanded = false,
  onAddTask,
  onUpdate,
}: BacklogSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between py-2 px-2 group">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray5 hover:text-gray4 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={18} className="text-gray4" />
            ) : (
              <ChevronRight size={18} className="text-gray4" />
            )}
            <span className="font-semibold text-sm">{title}</span>
          </button>
          <span className="text-gray3 text-sm ml-2">{tasks.length} tasks</span>
        </div>

        {/* 우측 아이콘들 */}
        {/* <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-gray3 hover:text-gray5 rounded transition-colors">
            <Settings size={16} />
          </button>
          <button className="p-1 text-gray3 hover:text-gray5 rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div> */}
      </div>

      {/* 태스크 목록 */}
      {isExpanded && (
        <div className="pl-6 space-y-2 mb-2">
          {tasks.map((task) => (
            <BacklogTaskRow key={task.taskId} task={task} onUpdate={onUpdate} />
          ))}

          {/* Add task 버튼 */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 py-2 px-4 text-gray3 hover:text-gray5 text-sm transition-colors"
          >
            <Plus size={14} />
            <span>Add task</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BacklogSection;
