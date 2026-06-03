import { useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FaArrowRightFromBracket } from "react-icons/fa6";

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks':     'Tasks',
  '/projects':  'Projects',
  '/team':      'Team',
  '/settings':  'Settings',
};

export const Topbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? '';

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? '?';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <span className="text-sm font-semibold text-gray-900"># {title}</span>

      <div className="flex items-center gap-3">
        {/* loc liber — notificări, search etc. */}

        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.role}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700 overflow-hidden">
          {user?.avatar
            ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            : initials
          }
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <i className="ti ti-logout text-base" aria-hidden="true" />
          Logout <FaArrowRightFromBracket />
        </button>
      </div>
    </header>
  );
};