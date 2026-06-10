import { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  MdDashboard, MdCheckBox, MdFolder, MdGroup, MdSettings, 
  MdExpandMore, MdSupervisedUserCircle, MdTerminal, MdMenuOpen, MdMenu
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { RiAdminFill } from "react-icons/ri";

const mainLinks = [
  { to: '/dashboard', label: 'sidebar.dashboard', icon: MdDashboard },
  { to: '/projects',  label: 'sidebar.projects',  icon: MdFolder    },
  { to: '/tasks',     label: 'sidebar.tasks',     icon: MdCheckBox  },
  { to: '/team',      label: 'sidebar.team',      icon: MdGroup     },
  { to: '/customers', label: 'sidebar.customers', icon: FaUsers     }
];

const adminLinks = [
  { to: '/admin/users',     label: 'admin.nav_users',     icon: MdSupervisedUserCircle },
  { to: '/admin/customers', label: 'admin.nav_customers', icon: FaUsers                },
  { to: '/admin/projects',  label: 'admin.nav_projects',  icon: MdFolder               },
  { to: '/admin/tasks',     label: 'admin.nav_tasks',     icon: MdCheckBox             },
  { to: '/admin/logs',      label: 'admin.nav_logs',      icon: MdTerminal             }
];

const settingsLink = { to: '/settings', label: 'sidebar.settings', icon: MdSettings };

export const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isAdminOpen, setIsAdminOpen]   = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed]   = useState<boolean>(()=>{
    const saved = localStorage.getItem('sidebar_collapsed')
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileOpen, setMobileOpen]     = useState<boolean>(false);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all no-underline
    ${isCollapsed ? 'justify-center px-0' : ''}
    ${isActive
      ? 'bg-indigo-600 text-white font-medium'
      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  const getSubLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-1.5 rounded-lg text-xs transition-all no-underline
    ${isCollapsed ? 'justify-center pl-0 pr-0' : 'pl-9 pr-3'}
    ${isActive
      ? 'text-indigo-400 font-semibold bg-indigo-500/5'
      : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
    }`;

  const sidebarInner = (mobile = false) => (
    <aside className={`h-screen bg-gray-900 flex flex-col transition-all duration-300 ease-in-out ${
      mobile ? 'w-56 min-w-56' : (isCollapsed ? 'w-16 min-w-16' : 'w-56 min-w-56')
    }`}>

      {/* Header */}
      <div className={`px-4 py-5 border-b border-gray-700/50 flex items-center ${
        !mobile && isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        {(mobile || !isCollapsed) && (
          <div className="truncate">
            <span className="text-base font-semibold text-white tracking-tight">VIVAT</span>
            <span className="text-base font-semibold text-indigo-400 tracking-tight"> WorkHub</span>
            <p className="text-xs text-gray-500 mt-0.5 tracking-wide">let's make money</p>
          </div>
        )}
        {/* Desktop: collapse toggle / Mobile drawer: close button */}
        {mobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-gray-200 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-gray-800 transition-colors shrink-0"
          >
            <MdMenuOpen size={20} />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed((prev)=>{
              const nextState = !prev
              localStorage.setItem('sidebar_collapsed', JSON.stringify(nextState))
              return nextState
            })}
            className="text-gray-500 hover:text-gray-200 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-gray-800 transition-colors shrink-0"
          >
            <MdMenuOpen size={20} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180 text-indigo-400' : ''}`} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">

        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to}
            className={getLinkClass}
            title={!mobile && isCollapsed ? t(label) : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} className="shrink-0" />
            {(mobile || !isCollapsed) && <span className="truncate">{t(label)}</span>}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <div className="flex flex-col gap-0.5 mt-1">
            <button
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                if (!mobile && isCollapsed) setIsCollapsed(false);
              }}
              className={`w-full flex items-center text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg transition-all bg-transparent border-0 cursor-pointer py-2 ${
                !mobile && isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
              }`}
              title={!mobile && isCollapsed ? t('sidebar.admin_panel', 'Admin Panel') : undefined}
            >
              <div className="flex items-center gap-3 truncate">
                <RiAdminFill className="text-lg shrink-0 text-gray-500" />
                {(mobile || !isCollapsed) && <span className="truncate">{t('sidebar.admin_panel', 'Admin Panel')}</span>}
              </div>
              {(mobile || !isCollapsed) && (
                <MdExpandMore
                  size={18}
                  className={`transition-transform duration-200 text-gray-500 ${isAdminOpen ? 'rotate-180 text-indigo-400' : ''}`}
                />
              )}
            </button>

            {isAdminOpen && (
              <div className="flex flex-col gap-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {adminLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to} to={to}
                    className={getSubLinkClass}
                    title={!mobile && isCollapsed ? t(label) : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} className="shrink-0" />
                    {(mobile || !isCollapsed) && <span className="truncate">{t(label)}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto">
          <NavLink
            to={settingsLink.to}
            className={getLinkClass}
            title={!mobile && isCollapsed ? t(settingsLink.label) : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <settingsLink.icon size={18} className="shrink-0" />
            {(mobile || !isCollapsed) && <span className="truncate">{t(settingsLink.label)}</span>}
          </NavLink>
        </div>

      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-gray-700/50 flex ${!mobile && isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <p className="text-xs text-gray-600 px-1 truncate">
          {!mobile && isCollapsed ? 'v1' : `v ${import.meta.env.PACKAGE_VERSION || '1.0.0'}`}
        </p>
      </div>

    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        {sidebarInner(false)}
      </div>

      {/* Mobile: buton hamburger fix */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
        aria-label="Open menu"
      >
        <MdMenu size={20} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            {sidebarInner(true)}
          </div>
        </>
      )}
    </>
  );
};