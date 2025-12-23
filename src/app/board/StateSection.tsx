"use client";

import StateTaskCard from "./StateTaskCard";
import { StateDataProps } from "./type";
import { useDroppable } from "@dnd-kit/core";
import { TaskStatus } from "@/lib/task/taskApi";

interface StateSectionProps {
  status: string;
  statusKey: TaskStatus;
  tasks: StateDataProps[];
  onTaskCreate?: () => void;
  dndDisabled?: boolean;
}

const StateSection = ({
  status,
  statusKey,
  tasks,
  onTaskCreate,
  dndDisabled
}: StateSectionProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: statusKey,
    data: { status: statusKey },
    disabled: statusKey === "ARCHIVED",
  });

  return (
    <section className="flex-1 min-w-[200px]">
      <h3 className="mb-3 ml-1 text-xl text-gray5 font-bold">{status}</h3>
      <ul
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-[200px] rounded-xl transition-colors duration-200 ${
          tasks.length > 0 || isOver ? "bg-gray1/80 p-4" : "bg-gray1/30 p-4"
        } ${isOver ? "ring-2 ring-blue-400 bg-blue-50/50" : ""}`}
      >
        {tasks.map((item) => (
          <StateTaskCard key={item.taskId} {...item} dndDisabled={dndDisabled} />
        ))}
        {tasks.length === 0 && !isOver && (
          <li className="text-center text-gray3 py-8">
            태스크를 여기에 드롭하세요
          </li>
        )}
        {isOver && (
          <li className="text-center text-blue-500 py-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
            여기에 놓기
          </li>
        )}
      </ul>
      <button
        className="w-full mt-6 text-center text-gray3 cursor-pointer hover:text-gray5 transition-colors"
        onClick={onTaskCreate}
      >
        + task 생성
      </button>
    </section>
  );
};

export default StateSection;
