import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Task, TaskAssignee } from "../../types/task.types";
import { BeatLoader } from "react-spinners";
import { getTaskById } from "../../services/task.service";
import { TaskHeader } from "../../components/taks/TaskHeader";
import { TaskDetails } from "../../components/taks/TaskDetails";
import { TaskAssignees } from "../../components/taks/TaskAssignees";
import type { UserData } from "../../types/auth.types";

type AssigneeWithuser = TaskAssignee & { user: UserData };

export const TaskDetailedPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { user } = useAuth();
    // Schimbat în <any> sau tipul tău extins pentru a nu crăpa la proprietățile populate (.project, .createdBy)
    const [task, setTask] = useState<Task>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getTaskById(Number(id))
            .then((res) => setTask(res))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

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
                    {/* Container alb cu margini rotunjite pentru Header & Viitoarele Comentarii */}
                    <div className=" overflow-hidden">
                        <TaskHeader id={task.id} title={task.title} description={task.description} />
                    </div>

                    {/* 💡 LOCAȚIE VIITOARE: Pune aici componentele <TaskComments /> și <TaskFiles /> */}
                    {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                         <TaskComments taskId={task.id} />
                    </div> */}
                </div>

                {/* COLOANA DREAPTĂ: Ocupă 1/3 din ecran pe desktop (Sidebar) */}
                {/* lg:sticky și lg:top-6 fac ca bara laterală să rămână fixă la scroll */}
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
                    />
                    <hr className="border-t border-slate-400" />
                    <TaskAssignees assignees={task.assignees as AssigneeWithuser[]} />
                </div>

            </div>
        </section>
    );
};