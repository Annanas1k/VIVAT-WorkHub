import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { MdDashboard, MdCheckBox, MdFolder, MdGroup, MdSettings, MdExpandMore, MdSupervisedUserCircle, MdTerminal } from "react-icons/md";
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

const settingsLink = { to: '/settings', label: 'sidebar.settings', icon: MdSettings };

export const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // 🟢 STARE: Controlează deschiderea meniului dropdown pentru Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all no-underline
    ${isActive
      ? 'bg-indigo-600 text-white font-medium'
      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  // Clasă dedicată pentru sub-paginile din interiorul dropdown-ului
  const getSubLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 pl-9 pr-3 py-1.5 rounded-lg text-xs transition-all no-underline
    ${isActive
      ? 'text-indigo-400 font-semibold bg-indigo-500/5'
      : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
    }`;

  return (
    <aside className="w-56 min-w-56 h-screen bg-gray-900 flex flex-col"> 

      <div className="px-5 py-5 border-b border-gray-700/50">
        <span className="text-base font-semibold text-white tracking-tight">VIVAT</span>
        <span className="text-base font-semibold text-indigo-400 tracking-tight"> WorkHub</span>
        <p className="text-xs text-gray-500 mt-0.5 tracking-wide">let's make money</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        
        {/* Linkuri Principale */}
        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={getLinkClass}>
            <Icon size={18} className="shrink-0" />
            {t(label)}
          </NavLink>
        ))}

        {/* 🟢 DROPDOWN ADMIN PANEL */}
        {user?.role === 'admin' && (
          <div className="flex flex-col gap-0.5 mt-1">
            {/* Butonul Trigger de Dropdown */}
            <button 
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg transition-all bg-transparent border-0 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RiAdminFill className="text-lg shrink-0 text-gray-500" />
                <span>{t('sidebar.admin_panel', 'Admin Panel')}</span>
              </div>
              <MdExpandMore 
                size={18} 
                className={`transition-transform duration-200 text-gray-500 ${isAdminOpen ? 'rotate-180 text-indigo-400' : ''}`} 
              />
            </button>

            {/* Sub-meniul (Apare doar dacă starea este true) */}
            {isAdminOpen && (
              <div className="flex flex-col gap-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <NavLink to="/admin/users" className={getSubLinkClass}>
                  <MdSupervisedUserCircle size={16} className="shrink-0" />
                  <span>{t('admin.nav_users', 'Users')}</span>
                </NavLink>
                
                <NavLink to="/admin/logs" className={getSubLinkClass}>
                  <MdTerminal size={16} className="shrink-0" />
                  <span>{t('admin.nav_logs', 'System Logs')}</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Link Setări la bază */}
        <div className="mt-auto"> 
          <NavLink to={settingsLink.to} className={getLinkClass}>
            <settingsLink.icon size={18} className="shrink-0" />
            {t(settingsLink.label)}
          </NavLink>
        </div>

      </nav>

      <div className="px-4 py-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-600 px-1">v {import.meta.env.PACKAGE_VERSION || '1.0.0'}</p>
      </div>

    </aside>
  );
};