import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../../types/task.types";
import { getAllTasks } from "../../services/task.service";
import { BeatLoader } from "react-spinners";
import {
  MdSearch,
  MdPerson,
  MdFilterList,
  MdCalendarToday,
  MdFlag
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { Link, useSearchParams } from "react-router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAuth } from "../../hooks/useAuth";
import { TaskModal } from "../../components/taks/TaskModal";

export const TasksPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery     = searchParams.get("search") ?? "";
  const onlyMyTasks     = searchParams.get("mine") === "true";
  const selectedStatus  = searchParams.get("status") ?? "all";
  const selectedPriority = searchParams.get("priority") ?? "all";

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === "all" || value === "" || value === "false") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  useEffect(() => {
    getAllTasks()
      .then((res) => setTasks(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const priorityStyles: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    medium: "bg-amber-50 text-amber-700 border-amber-100",
    high: "bg-rose-50 text-rose-600 border-rose-100",
    urgent: "bg-red-100 text-red-700 border-red-200 font-bold animate-pulse",
  };

  const statusStyles: Record<string, string> = {
    backlog: "bg-slate-100 text-slate-600",
    todo: "bg-blue-50 text-blue-600 border border-blue-100",
    in_progress: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    review: "bg-purple-50 text-purple-600 border border-purple-100",
    done: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
    const matchesMine = !onlyMyTasks || task.assignees?.some(
      (assignee) => assignee.user.id === user?.id
    );
    return matchesSearch && matchesStatus && matchesPriority && matchesMine;
  });

  const canManage = user?.role === "admin" || user?.role === "manager" || user?.role === "team_lead";

  const openNew = () => {
    setEditing(null);
    setIsModal(true);
  };

  const openEdit = (task: Task) => {
    if (!canManage) return;
    setEditing(task);
    setIsModal(true);
  };

  const handleSaved = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [...prev, task];
    });
    setIsModal(false);
  };

  const handleDeleted = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsModal(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
      </div>
    );
  }

  return (
    <section className="p-6 bg-slate-50 min-h-screen w-full flex flex-col gap-4 text-slate-800">

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono text-slate-900">{filteredTasks.length}</span>
          <p className="text-sm font-medium text-slate-500">{t("tasks.total_count", "tasks total")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("tasks.search_placeholder", "Caută task...")}
              value={searchQuery}
              onChange={(e) => setParam("search", e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-4xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-56"
            />
          </div>

          <div className="flex">
            <button
              onClick={() => setParam("mine", "true")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-l-4xl text-sm font-medium border transition-all ${
                onlyMyTasks
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MdPerson className="w-4 h-4" />
            </button>
            <button
              onClick={() => setParam("mine", "false")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-r-4xl text-sm font-medium border transition-all ${
                onlyMyTasks
                  ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  : "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
              }`}
            >
              <FaUsers className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-4xl px-2 py-1.5">
            <MdFilterList className="text-slate-400 w-4 h-4" />
            <select
              value={selectedStatus}
              onChange={(e) => setParam("status", e.target.value)}
              className="text-sm font-medium text-slate-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">{t("tasks.filter.all_statuses", "Toate Statusurile")}</option>
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-4xl px-2 py-1.5">
            <MdFlag className="text-slate-400 w-4 h-4" />
            <select
              value={selectedPriority}
              onChange={(e) => setParam("priority", e.target.value)}
              className="text-sm font-medium text-slate-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">{t("tasks.filter.all_priorities", "Toate Prioritățile")}</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-4xl px-2 py-1.5">
            <BsThreeDotsVertical className="text-slate-400 w-4 h-4" />
          </div>

          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-sm font-medium border transition-all bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="py-3 px-5">{t("tasks.table.taskName", "Nume Task")}</th>
                <th className="py-3 px-5 w-50">{t("tasks.table.assignee", "Asignat")}</th>
                <th className="py-3 px-5 w-50">{t("tasks.table.dueDate", "Termen Limită")}</th>
                <th className="py-3 px-5 w-50">{t("tasks.table.priority", "Prioritate")}</th>
                <th className="py-3 px-5 w-50">{t("tasks.table.status", "Status")}</th>
                <th className="py3 px-5 w-20">{t('tasks.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 font-medium italic">
                    {t("tasks.no_tasks_found", "Nu am găsit niciun task conform filtrelor alese.")}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5 max-w-md">
                      <div className="flex flex-col gap-0.5">
                        <Link
                          to={`/tasks/${task.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors hover:underline"
                        >
                          {task.title}
                        </Link>
                        {task.description && (
                          <span className="text-xs text-slate-400 line-clamp-1 font-medium">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center -space-x-2 overflow-hidden">
                        {task.assignees && task.assignees.length > 0 ? (
                          task.assignees.map((assignee) => {
                            const u = assignee.user;
                            const initials = u?.name
                              ? u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                              : "??";
                            return u?.avatar ? (
                              <img
                                key={assignee.id}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover object-center"
                                src={u.avatar}
                                alt={u.name}
                                title={u.name}
                              />
                            ) : (
                              <div
                                key={assignee.id}
                                title={u?.name}
                                className="h-7 w-7 rounded-full ring-2 ring-white bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center border border-indigo-100 uppercase"
                              >
                                {initials}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-slate-300 text-xs italic">{t("tasks.unassigned", "Neasignat")}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium font-mono">
                        <MdCalendarToday className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(task.dueDate)}
                      </div>
                    </td>

                    <td className="px-5 h-full">
                      <span className={`block w-full py-5 text-center rounded-md text-xs font-semibold uppercase tracking-wider border ${
                        priorityStyles[task.priority] || "bg-slate-50 text-slate-600"
                      }`}>
                        {task.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusStyles[task.status] || "bg-slate-100"
                      }`}>
                        {task.status?.replace("_", " ")}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => openEdit(task)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-sm font-medium border transition-all bg-orange-100 border-orange-200 text-orange-600 shadow-sm cursor-pointer"
                        >
                          {t('tasks.edit', 'Edit')}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModal && (
        <TaskModal
          task={editing}
          showProjectSelect
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onClose={() => { setIsModal(false); setEditing(null); }}
        />
      )}
    </section>
  );
};