"use client";

import { useState } from "react";
import {
  Calendar,
  Clipboard,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Board");

  const menuItems = [
    { name: "Backlog", icon: Clipboard, hasNotification: false },
    { name: "Board", icon: LayoutDashboard, hasNotification: false },
    { name: "Inbox", icon: MessageSquare, hasNotification: true },
  ];

  const teamMembers = [
    { id: "user01", name: "사용자1", isOnline: true },
    { id: "user02", name: "사용자2", isOnline: false },
    { id: "user03", name: "사용자3", isOnline: true },
    { id: "user04", name: "사용자4", isOnline: true },
    { id: "user05", name: "사용자5", isOnline: false },
    { id: "user06", name: "사용자6", isOnline: true },
    { id: "user07", name: "사용자7", isOnline: true },
    { id: "user08", name: "사용자8", isOnline: false },
    { id: "user09", name: "사용자9", isOnline: true },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Project Name</div>
          </div>
        </div>
      </div>

      {/* 메뉴 항목 */}
      <nav className="flex-1 overflow-y-auto flex flex-col justify-between">
        <div className="p-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative hover:bg-gray-100 ${
                  activeMenu === item.name
                    ? "text-primary font-semibold"
                    : "text-gray-600"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* 접속 목록 */}
        <div className="px-3 py-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 mb-2">
            접속 목록
          </h3>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <div className="relative">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      member.isOnline
                        ? "bg-gray-300 text-gray-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {member.id[9]}
                  </div>
                  {member.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-gray-50"></span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    member.isOnline ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {member.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 팀관리 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg transition-colors font-medium text-sm hover:opacity-90">
          <span>+</span>
          <span> 팀관리</span>
        </button>
      </div>
    </aside>
  );
}
