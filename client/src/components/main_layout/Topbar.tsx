import { Link, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

const pageTitles: Record<string, string> = {
  '/dashboard':      'sidebar.dashboard',
  '/tasks':          'sidebar.tasks',
  '/projects':       'sidebar.projects',
  '/team':           'sidebar.team',
  '/settings':       'sidebar.settings',
  '/profile':        'sidebar.profile',
  '/customers':      'sidebar.customers',
  '/admin/logs':     'sidebar.logs',
  '/admin/logs/:id': 'sidebar.logs',
};

export const Topbar = () => {
  const { t } = useTranslation();
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

      {/* Title — offset pe mobil ca să nu se suprapună cu hamburger-ul */}
      <span className="text-sm font-semibold text-gray-900 pl-8 md:pl-0"># {t(title)}</span>

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <Link to={`/profile/${user?.id}`} className="text-sm font-medium text-gray-900 leading-none">
            {user?.name}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{user?.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700 overflow-hidden shrink-0">
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
          <span className="hidden sm:inline">{t('topbar.logout')}</span>
          <FaArrowRightFromBracket />
        </button>
      </div>

    </header>
  );
};