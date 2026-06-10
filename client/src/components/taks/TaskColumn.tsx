import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '../../types/task.types';
import { TaskCard } from './TaskCard';

type Props = {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  canDrag: boolean;
  onCardClick: (task: Task) => void;
};

export const TaskColumn = ({ id, label, color, tasks, canDrag, onCardClick }: Props) => (
  <div className={`flex flex-col rounded-xl border border-gray-100 bg-white p-3 min-h-96 border-t-4 shadow-sm ${color}`}>
    <div className="flex items-center justify-between mb-3 px-1">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</h3>
      <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">
        {tasks.length}
      </span>
    </div>

    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-2 flex-1 rounded-lg p-1 transition-colors ${
            snapshot.isDraggingOver ? 'bg-indigo-50/60' : ''
          }`}
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id.toString()} index={index}   isDragDisabled={!canDrag}
>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard
                    task={task}
                    isDragging={snapshot.isDragging}
                    onClick={() => onCardClick(task)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          {tasks.length === 0 && !snapshot.isDraggingOver && (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-300 py-6">
              No tasks
            </div>
          )}
        </div>
      )}
    </Droppable>
  </div>
);