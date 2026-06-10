import { NavLink, Outlet, useParams } from 'react-router';
import { MdExpandMore } from 'react-icons/md';
import { useEffect, useState, useRef } from 'react';
import type { Project, ProjectStatus } from '../../types/project.types';
import { getProjectById, updateProject } from '../../services/project.service';
import { BeatLoader } from 'react-spinners';
import { MdPersonAdd } from 'react-icons/md';
import { ProjectMembersPanel } from '../../components/projects/ProjectsMemberPanel';
const TABS = [
  { to: 'overview',      label: 'Overview'      },
  { to: 'tasks',         label: 'Tasks'         },
  { to: 'board',         label: 'Board'    },
  { to: 'timesheets',    label: 'Timesheets'    },
  { to: 'finance',       label: 'Finance'       },
  { to: 'files',         label: 'Files'         },
  { to: 'discussions',   label: 'Discussions'   },
  { to: 'activity-feed', label: 'Activity Feed' },
];

const STATUS_OPTIONS: { value: ProjectStatus; label: string; badge: string }[] = [
  { value: 'active',    label: 'Active',    badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'on_hold',   label: 'On Hold',   badge: 'bg-amber-100 text-amber-700'    },
  { value: 'completed', label: 'Completed', badge: 'bg-indigo-100 text-indigo-700'  },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-100 text-red-700'        },
];

export const ProjectDetailPage = () => {
  const { id } = useParams();

  const [project, setProject]           = useState<Project | null>(null);
  const [loading, setLoading]           = useState(true);
  const [statusOpen, setStatusOpen]     = useState(false);
  const [updatingStatus, setUpdating]   = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const dropdownRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjectById(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!project || status === project.status) return setStatusOpen(false);
    setStatusOpen(false);
    setUpdating(true);
    const prev = project.status;
    setProject(p => p ? { ...p, status } : p);
    try {
      await updateProject(Number(id), { status });
    } catch {
      setProject(p => p ? { ...p, status: prev } : p);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <BeatLoader size={15} color="#4D179A" />
    </div>
  );

  if (!project) return null;

  const currentStatus = STATUS_OPTIONS.find(s => s.value === project.status)!;

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <div className="px-6 pt-5 pb-0 border-b border-gray-100">

        <div className="flex items-start justify-between mb-3">

          <div className="flex flex-col gap-1">


            <div className="flex items-center gap-2">
              <div className='flex flex-col items-start'>
              <h1 className="text-base font-bold text-gray-900">{project.name}</h1>
                          {project.customerId && (
              <p className="text-xs text-gray-400">{project.customer.name}</p>
            )}
              </div>
              
              <div className="relative mb-3" ref={dropdownRef}>
                <button
                  onClick={() => setStatusOpen(o => !o)}
                  disabled={updatingStatus}
                  className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full transition-opacity ${currentStatus.badge} ${updatingStatus ? 'opacity-50' : 'hover:opacity-80'}`}
                >
                  {updatingStatus ? '...' : currentStatus.label}
                  <MdExpandMore size={13} className={`transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                </button>

                {statusOpen && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 min-w-36 animate-in fade-in slide-in-from-top-1 duration-150">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(s.value)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${
                          s.value === project.status ? 'opacity-50 cursor-default' : ''
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.badge.replace('text-', 'bg-').split(' ')[0].replace('bg-', 'bg-').split('-100')[0]}-500`} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                
              </div>
            </div>

          </div>

          {/* Avatare membri + settings */}
          <div className="flex items-center gap-3">
            {project.members && project.members.length > 0 && (
              <div className="flex -space-x-2">
                {project.members.slice(0, 5).map(m => (
                  <div
                    key={m.id}
                    title={m.user?.name}
                    className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white text-[10px] font-bold text-indigo-600 flex items-center justify-center uppercase overflow-hidden"
                  >
                    {m.user?.avatar
                      ? <img src={m.user.avatar} alt={m.user.name} className="w-full h-full object-cover" />
                      : m.user?.name?.charAt(0) ?? '?'
                    }
                  </div>
                ))}
                {project.members.length > 5 && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-[10px] font-bold text-gray-500 flex items-center justify-center">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMemberModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 cursor-pointer text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MdPersonAdd size={14} />
            </button>

            {memberModalOpen && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-100 w-85 p-5">
                  <ProjectMembersPanel projectId={Number(id)} />
                  <button
                    onClick={() => setMemberModalOpen(false)}
                    className="mt-3 w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
};