import { NavLink } from 'react-router';
import { MdDashboard, MdCheckBox, MdFolder, MdGroup, MdSettings } from "react-icons/md";
import type { IconType } from 'react-icons';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/tasks',     label: 'Tasks',     icon: MdCheckBox  },
  { to: '/projects',  label: 'Projects',  icon: MdFolder    },
  { to: '/team',      label: 'Team',      icon: MdGroup     },
];

const settingsLink = { to: '/settings', label: 'Settings', icon: MdSettings };

export const Sidebar = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all no-underline
    ${isActive
      ? 'bg-indigo-600 text-white font-medium'
      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  return (
    <aside className="w-56 min-w-56 h-screen bg-gray-900 flex flex-col"> {/* ◄ Adăugat h-screen pentru a ocupa toată înălțimea ecranului */}

      <div className="px-5 py-5 border-b border-gray-700/50">
        <span className="text-base font-semibold text-white tracking-tight">VIVAT</span>
        <span className="text-base font-semibold text-indigo-400 tracking-tight"> WorkHub</span>
        <p className="text-xs text-gray-500 mt-0.5 tracking-wide">let's make money</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        
        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={getLinkClass}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <div className="mt-auto"> {/* ◄ Trucul Flexbox: Împinge tot ce urmează la bază */}
          <NavLink to={settingsLink.to} className={getLinkClass}>
            <settingsLink.icon size={18} />
            {settingsLink.label}
          </NavLink>
        </div>

      </nav>

      <div className="px-4 py-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-600 px-1">v {import.meta.env.PACKAGE_VERSION || '1.0.0'}</p>
      </div>

    </aside>
  );
};