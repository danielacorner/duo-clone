import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  icon: JSX.Element;
  path: string;
  label: string;
  bgColor: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
      </svg>
    ),
    path: '/',
    label: 'Home',
    bgColor: 'bg-orange-500',
  },
  {
    id: 'learn',
    icon: <span className="text-3xl font-bold">あ</span>,
    path: '/learn',
    label: 'Learn',
    bgColor: 'bg-blue-500',
  },
  {
    id: 'practice',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
    path: '/practice',
    label: 'Practice',
    bgColor: 'bg-blue-400',
  },
  {
    id: 'leaderboard',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9 9H2l6 5-2 8 6-4 6 4-2-8 6-5h-7l-3-7z" />
      </svg>
    ),
    path: '/leaderboard',
    label: 'Leaderboard',
    bgColor: 'bg-yellow-500',
  },
  {
    id: 'shop',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4v2H5v14h14V6h-2V4h-2v2H9V4H7zm0 6h10v8H7v-8z" />
      </svg>
    ),
    path: '/shop',
    label: 'Shop',
    bgColor: 'bg-red-500',
  },
  {
    id: 'profile',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 14c-5 0-8 3-8 6v2h16v-2c0-3-3-6-8-6z" />
      </svg>
    ),
    path: '/profile',
    label: 'Profile',
    bgColor: 'bg-amber-600',
  },
  {
    id: 'more',
    icon: <span className="text-3xl">⋯</span>,
    path: '/more',
    label: 'More',
    bgColor: 'bg-purple-500',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-[70px] bg-[#131F24] flex flex-col items-center py-4 gap-2 border-r border-gray-800">
      {/* Duo Owl Logo */}
      <div className="w-14 h-14 bg-duo-green rounded-xl flex items-center justify-center text-3xl mb-2 shadow-lg">
        🦉
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => {
        const isActive = location.pathname === item.path ||
                        (item.path === '/learn' && location.pathname === '/');
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 ${
              isActive ? item.bgColor : 'bg-transparent hover:bg-gray-800'
            }`}
            title={item.label}
          >
            {isActive && (
              <div className="absolute inset-0 rounded-xl border-[3px] border-blue-500" />
            )}
            <div className={`relative z-10 ${isActive ? '' : 'opacity-50'}`}>
              {item.icon}
            </div>
          </Link>
        );
      })}

      {/* Edit Button at Bottom */}
      <div className="mt-auto mb-2">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-400 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
