import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Project } from "../../types/project.types";
import { getProjectById } from "../../services/project.service";
import { BeatLoader } from "react-spinners";
import { DetailsCard } from "../../components/projects/DetailsCard";
import { Card } from "../../components/projects/InfoCard";
import { MdFormatListBulleted, MdPeopleOutline, MdCalendarToday, MdOutlineMonetizationOn, MdNearbyError } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { TaskProgressCard } from "../../components/projects/ProgresTasks";
import { ProjectMembersCard } from "../../components/projects/ProjectMembersCard";

export const ProjectDetailOverview = () => {
    const { t } = useTranslation();
    const { id } = useParams();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getProjectById(id)
            .then((res) => setProject(res))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="w-full p-6 text-center text-gray-500 bg-slate-50 min-h-screen">
                {t('projects.overview.not_found', 'Project not found')}
            </div>
        );
    }

    const totalBudget = project.budget || 0;
    const totalMembers = project.members?.length || 0;
    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter((task) => task.status === "done").length || 0;

    const formattedDueDate = project.dueDate 
        ? new Date(project.dueDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })
        : t('projects.overview.without_time', 'without time');

    const calculateRemainingDays = (dueDateString) => {
        if (!dueDateString) return 0;
        const diffTime = new Date(dueDateString).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };
    const remainingDays = calculateRemainingDays(project.dueDate);

    const CARDS_INFO = [
        {
            id: 1,
            icon: MdFormatListBulleted,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            title: "projects.overview.total_tasks",
            count: totalTasks,
            text: `${completedTasks} ${t("projects.overview.task_done")}`,
        },
        {
            id: 2,
            icon: MdNearbyError,
            iconBg: "bg-orange-50",
            iconColor: "text-orange-600",
            title: "projects.overview.high_priority",
            count: project.tasks?.filter(t => t.priority === "high" || t.priority === "urgent").length || 0,
            text: t("projects.overview.urgent_tasks"),
            countColor: "text-orange-500",
        },
        {
            id: 3,
            icon: MdPeopleOutline,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            title: "projects.overview.total_members",
            count: totalMembers,
            text: `0 ${t("projects.overview.now_active")}`,
        },
        {
            id: 4,
            icon: MdCalendarToday,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            title: "projects.overview.dueDate",
            count: `${remainingDays} ${t("projects.overview.days")}`,
            countColor: "text-amber-500",
            text: `${t("projects.overview.dueDate")}: ${formattedDueDate}`,
        },
        {
            id: 5,
            icon: MdOutlineMonetizationOn,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            title: "projects.overview.budget",
            count: `$${totalBudget.toLocaleString()}`,
            text: t("projects.overview.allocated_budget"),
            textColor: "text-emerald-500",
        },
    ];

    return (
        <section className="p-6 bg-slate-50 min-h-screen w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
                
                {/* PARTEA STÂNGĂ (Ocupă 2/3 din ecran pe desktop) */}
                <div className="lg:col-span-2 flex flex-col gap-6 w-full">
                    
                    {/* Grila pentru cele 5 carduri (Structură 3 + 2) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        {/* Primele 3 carduri */}
                        {CARDS_INFO.slice(0, 3).map((c) => (
                            <Card 
                                key={c.id} 
                                icon={c.icon} 
                                title={t(c.title)} 
                                count={c.count} 
                                text={c.text} 
                                countColor={c.countColor}
                                textColor={c.textColor}
                                iconBg={c.iconBg}
                                iconColor={c.iconColor}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        {/* Ultimele 2 carduri care ocupă același spațiu proporțional */}
                        {CARDS_INFO.slice(3, 5).map((c) => (
                            <Card 
                                key={c.id} 
                                icon={c.icon} 
                                title={t(c.title)} 
                                count={c.count} 
                                text={c.text} 
                                countColor={c.countColor}
                                textColor={c.textColor}
                                iconBg={c.iconBg}
                                iconColor={c.iconColor}
                            />
                        ))}
                        {/* Spațiu gol artificial (placeholder) pe al doilea rând pentru a păstra alinierea perfectă cu rândul de sus */}
                        <div className="hidden md:block" />
                    </div>

                    {/* Dedesubt: Detaliile Proiectului */}
                    <div className="w-full max-w-none">
                        <DetailsCard projectData={project} />
                    </div>
                </div>

                {/* PARTEA DREAPTĂ (Ocupă 1/3 din ecran pe desktop) */}
                <div className="flex flex-col gap-6 w-full">
                    {/* Sus: Task Progress */}
                    <div className="w-full">
                        <TaskProgressCard projectData={project} />
                    </div>
                    {/* Dedesubt: Lista cu echipa */}
                    <div className="w-full">
                        <ProjectMembersCard projectData={project} />
                    </div>
                </div>

            </div>
        </section>
    );
};