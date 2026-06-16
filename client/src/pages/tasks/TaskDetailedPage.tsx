import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router"; // Adăugat useNavigate pentru cazul de ștergere
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Task, TaskAssignee } from "../../types/task.types";
import { BeatLoader } from "react-spinners";
import { getTaskById } from "../../services/task.service";
import { TaskHeader } from "../../components/taks/TaskHeader";
import { TaskDetails } from "../../components/taks/TaskDetails";
import { TaskAssignees } from "../../components/taks/TaskAssignees";
import type { UserData } from "../../types/auth.types";
import { TaskModal } from "../../components/taks/TaskModal";
import { updateTask } from "../../services/task.service";
import { CommentsPanel } from "../../components/comments/CommentPanel";
import { AttachmentsPanel } from "../../components/attachment/AttachmentsPanel";

type AssigneeWithuser = TaskAssignee & { user: UserData };

export const TaskDetailedPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [task, setTask] = useState<Task>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [editing, setEditing] = useState<Task | null>(null);

    useEffect(() => {
        getTaskById(Number(id))
            .then((res) => setTask(res))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const canManage = user?.role === "admin" || user?.role === "manager" || user?.role === "team_lead";

    const openEdit = (taskToEdit: Task) => {
        if (!canManage) return;
        setEditing(taskToEdit);
        setIsModal(true);
    };

    const handleSaved = (updatedTask) => {
        setTask(updatedTask);
        setIsModal(false);
        setEditing(null);
    };

    // Corectat: Dacă task-ul curent este șters din modal, redirecționăm utilizatorul înapoi la dashboard/listă
    const handleDeleted = () => {
        // setIsModal(false);
        // setEditing(null);
        navigate("/tasks"); 
    };

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
            <BeatLoader size={15} color="#4D179A" />
        </div>
    );

    if (!task) return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
            {t('tasks.not_found', 'Task-ul nu a fost găsit.')}
        </div>
    );

    return (
        <section className="min-h-screen w-full bg-slate-50 p-4 md:p-6 text-slate-800"> 
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* COLOANA STÂNGĂ: Ocupă 2/3 din ecran pe desktop (Main Content Area) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="overflow-hidden  rounded-xl border border-slate-200 ">
                        <TaskHeader task={task} onEditClick={openEdit} />
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Files</h3>
                        <AttachmentsPanel
                            entityType="task"
                            entityId={task.id}
                            currentUserId={user?.id}
                            currentUserRole={user?.role}
                        />
                        </div>

                    {/* 💡 LOCAȚIE VIITOARE: <TaskComments taskId={task.id} /> */}
                    <CommentsPanel
                    entityType="task"
                    entityId={task.id}
                    currentUserId={user?.id}
                    />
                </div>

                {/* COLOANA DREAPTĂ: Ocupă 1/3 din ecran pe desktop (Sidebar) */}
                <div className="flex flex-col gap-4 lg:sticky lg:top-6 w-full">
                    <TaskDetails 
                        status={task.status}
                        priority={task.priority}
                        createdAt={task.createdAt}
                        dueDate={task.dueDate}
                        projectId={task.projectId}
                        updatedAt={task.updatedAt}
                        createdById={task.createdById}
                        project={task.project}
                        createdBy={task.createdBy} 
                       onStatusChange={async (newStatus) => {
                        const oldStatus = task.status;

                        try {
                            setTask((prev: any) => ({ ...prev, status: newStatus }));

                            await updateTask(task.id, { status: newStatus });
                            
                            console.log("Status actualizat cu succes în baza de date!");
                        } catch (error) {
                            console.error("Eroare la actualizarea statusului:", error);
                            setTask((prev) => ({ ...prev, status: oldStatus }));
                            alert(t('tasks.errors.update_failed', 'Nu s-a putut salva noul status. Încearcă din nou.'));
                        }
                    }}
                    />
                    
                    {/* Linia de separare fină */}
                    <hr className="border-t border-slate-200" />
                    
                    <TaskAssignees assignees={task.assignees as AssigneeWithuser[]} />
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