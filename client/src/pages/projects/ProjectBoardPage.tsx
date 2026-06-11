import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router"
import type { IApi } from "@svar-ui/react-gantt"
import { Gantt, Willow, Editor, Toolbar } from "@svar-ui/react-gantt"
import "@svar-ui/react-gantt/all.css"
import { getProjectTasks } from "../../services/task.service"
import { BeatLoader } from "react-spinners"
import type { Task } from "../../types/task.types"
import { createTask, updateTask, deleteTask } from "../../services/task.service"

// Scales: Year > Month > Week
const scales = [
  { unit: "year",  step: 1, format: "%Y" },
  { unit: "month", step: 1, format: "%M" },
  { unit: "week",  step: 1, format: "%w" },
  // { unit: "day",   step: 1, format: "%d"}
]

function toGanttTask(task: Task) {
  const start = new Date(task.createdAt)
  const end = task.dueDate
    ? new Date(task.dueDate)
    : new Date(Date.now() + 7 * 86400000) // default: +7 zile

  const duration = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  )

  return {
    id: task.id,
    text: task.title,
    start,
    end,
    duration,
    progress:
      task.status === "done"        ? 100 :
      task.status === "in_progress" ? 50  : 0,
    type: "task" as const,
    // câmpuri custom — păstrate de Gantt, vizibile în Editor
    status:      task.status,
    priority:    task.priority,
    description: task.description ?? "",
  }
}

export const ProjectBoardPage = () => {
  const { id }  = useParams()
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [api,     setApi]     = useState<IApi | undefined>(undefined)

  useEffect(() => {
    getProjectTasks(Number(id))
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // Save on server — interceptăm fiecare acțiune și trimitem la backend
const initGantt = useCallback((ganttApi: IApi) => {
  setApi(ganttApi)

  // add-task: NU facem POST aici, doar marcăm că e nou
  ganttApi.intercept("add-task", (ev) => {
    console.log("add-task:", JSON.stringify(ev))
    // lăsăm Gantt să adauge task-ul local cu id temporar
  })

  // update-task: se declanșează când userul salvează din Editor
  ganttApi.intercept("update-task", async (ev) => {
    console.log("update-task:", JSON.stringify(ev))
    const { id: taskId, task } = ev

    try {
      // dacă id-ul e temporar (număr mare generat de Gantt intern)
      // sau nu există în DB — facem POST
      const isTemporary = !taskId || String(taskId).startsWith("tmp")

      if (isTemporary) {
        const saved = await createTask({
          title:     task.text || "New Task",
          dueDate:   task.end ? String(task.end) : undefined,
          status:    "backlog",
          priority:  "medium",
          projectId: Number(id),
        })
        // actualizăm id-ul în Gantt cu cel real din DB
        ganttApi.exec("update-task", { id: taskId, task: { ...task, id: saved.id } })
      } else {
        await updateTask(Number(taskId), {
          title:       task.text,
          dueDate:     task.end ? String(task.end) : undefined,
          status:      task.status,
          priority:    task.priority,
          description: task.description,
        })
      }
    } catch (err) {
      console.error("Failed to save task:", err)
    }
  })

  ganttApi.intercept("delete-task", async (ev) => {
    console.log("delete-task:", JSON.stringify(ev))
    const { id: taskId } = ev
    if (!taskId || isNaN(Number(taskId)) || Number(taskId) > 1_000_000) return
    try {
      await deleteTask(Number(taskId))
    } catch (err) {
      console.error("Failed to delete task:", err)
    }
  })
}, [id])

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <BeatLoader size={15} color="#4D179A" loading />
      </div>
    )
  }

  const ganttTasks = tasks.map(toGanttTask)

  return (
    <div style={{ height: "calc(100vh - 120px)", width: "100%" }}>
      <Willow>
        <Toolbar api={api} />
        <Gantt
          tasks={ganttTasks}
          scales={scales}
          autoScale={true}
          init={initGantt}
        />
        {api && <Editor api={api} />}
      </Willow>
    </div>
  )
}