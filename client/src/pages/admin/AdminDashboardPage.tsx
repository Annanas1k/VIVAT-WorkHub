import { useNavigate } from 'react-router';
import { HiOutlineUsers, HiOutlineFolder, HiOutlineClipboardList, HiOutlineDatabase } from 'react-icons/hi';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  // Configurația tabelelor din aplicație
  const managementCards = [
    {
      id: 'users',
      title: 'User Accounts',
      description: 'Manage system users, update roles, phones, and credentials.',
      icon: <HiOutlineUsers className="text-2xl text-indigo-600" />,
      path: '/admin/users',
      count: 'Active'
    },
    {
      id: 'projects',
      title: 'Projects Data',
      description: 'View, create, or delete global projects and ownerships.',
      icon: <HiOutlineFolder className="text-2xl text-amber-600" />,
      path: '/admin/projects',
      count: 'Future'
    },
    {
      id: 'tasks',
      title: 'Tasks & Issues',
      description: 'Override tasks, modify states, and clean up workspace items.',
      icon: <HiOutlineClipboardList className="text-2xl text-emerald-600" />,
      path: '/admin/tasks',
      count: 'Future'
    },
    {
      id: 'system',
      title: 'System Logs',
      description: 'View server health, database state, and audit logs.',
      icon: <HiOutlineDatabase className="text-2xl text-purple-600" />,
      path: '/admin/logs',
      count: 'Logs'
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">🛡️ System Administration</h1>
        <p className="text-sm text-gray-400 mt-1">Select an entity table to view, edit, or clean up application records.</p>
      </div>

      {/* Grid-ul de Carduri Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {managementCards.map((card) => (
          <div
            key={card.id}
            onClick={() => card.count !== 'Future' && navigate(card.path)}
            className={`p-5 bg-white border border-gray-100 rounded-xl shadow-sm transition-all flex flex-col justify-between ${
              card.count === 'Future' 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:border-gray-200 hover:shadow-md cursor-pointer'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg inline-block">
                  {card.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  card.count === 'Active' ? 'bg-indigo-50 text-indigo-600' :
                  card.count === 'Logs' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {card.count}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
            </div>
            
            {card.count !== 'Future' && (
              <div className="mt-4 pt-3 border-t border-gray-50 text-right text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Open Table &rarr;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};