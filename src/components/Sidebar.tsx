import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReactElement } from "react";

interface NavItem {
  id: string;
  icon: ReactElement;
  path: string;
  labelKey: string;
  bgColor: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
      </svg>
    ),
    path: "/",
    labelKey: "nav.learn",
    bgColor: "bg-orange-500",
  },
  {
    id: "learn",
    icon: <span className="text-4xl font-bold">あ</span>,
    path: "/learn",
    labelKey: "nav.learn",
    bgColor: "bg-blue-500",
  },
  {
    id: "practice",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
    path: "/practice",
    labelKey: "nav.practice",
    bgColor: "bg-blue-400",
  },
  {
    id: "leaderboard",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9 9H2l6 5-2 8 6-4 6 4-2-8 6-5h-7l-3-7z" />
      </svg>
    ),
    path: "/leaderboard",
    labelKey: "nav.leaderboard",
    bgColor: "bg-yellow-500",
  },
  {
    id: "shop",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4v2H5v14h14V6h-2V4h-2v2H9V4H7zm0 6h10v8H7v-8z" />
      </svg>
    ),
    path: "/shop",
    labelKey: "nav.shop",
    bgColor: "bg-red-500",
  },
  {
    id: "profile",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 14c-5 0-8 3-8 6v2h16v-2c0-3-3-6-8-6z" />
      </svg>
    ),
    path: "/profile",
    labelKey: "nav.profile",
    bgColor: "bg-amber-600",
  },
  {
    id: "more",
    icon: <span className="text-4xl">⋯</span>,
    path: "/more",
    labelKey: "nav.more",
    bgColor: "bg-purple-500",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="sidebar fixed left-0 top-0 h-screen w-20 bg-[#131F24] flex flex-col items-center py-5 gap-3 border-r border-gray-800">
      {/* Duo Owl Logo */}
      <div className="w-16 h-16 bg-duo-green rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-lg">
        🦉
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === "/learn" && location.pathname === "/");
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 ${
              isActive ? item.bgColor : "bg-transparent hover:bg-gray-800"
            }`}
            title={t(item.labelKey)}
          >
            {isActive && (
              <div className="absolute inset-0 rounded-2xl border-[3px] border-blue-500" />
            )}
            <div className={`relative z-10 ${isActive ? "" : "opacity-50"}`}>
              {item.icon}
            </div>
          </Link>
        );
      })}

      {/* Edit Button at Bottom */}
      <div className="mt-auto mb-3">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-400 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
