import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  icon: string;
  path: string;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', path: '/', label: 'Home', color: 'bg-duo-green' },
  { id: 'learn', icon: 'あ', path: '/learn', label: 'Learn', color: 'bg-duo-blue' },
  { id: 'practice', icon: '🔧', path: '/practice', label: 'Practice', color: 'bg-blue-500' },
  { id: 'leaderboard', icon: '🏆', path: '/leaderboard', label: 'Leaderboard', color: 'bg-duo-yellow' },
  { id: 'shop', icon: '🛒', path: '/shop', label: 'Shop', color: 'bg-duo-red' },
  { id: 'profile', icon: '👤', path: '/profile', label: 'Profile', color: 'bg-gray-400' },
  { id: 'more', icon: '⚙️', path: '/more', label: 'More', color: 'bg-purple-500' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-duo-dark flex flex-col items-center py-4 gap-4">
      <div className="w-12 h-12 bg-duo-green rounded-xl flex items-center justify-center text-2xl mb-4">
        🦉
      </div>

      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 ${
              isActive ? item.color + ' shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={item.label}
          >
            <span>{item.icon}</span>
          </Link>
        );
      })}

      <div className="mt-auto">
        <button className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-xl hover:bg-gray-600 transition-all">
          ✏️
        </button>
      </div>
    </div>
  );
}
