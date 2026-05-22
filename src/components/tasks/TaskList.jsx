// Sortable task list with drag-and-drop via @dnd-kit.
import { AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";
import { TaskEmpty } from "./TaskEmpty";
import { useTasks } from "../../hooks/useTasks";

// Wrapper that makes each TaskCard sortable
function SortableTaskCard({ task, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleEditClick = (e) => {
    // Triggered when the edit button inside TaskCard is clicked
    if (e.target.closest("[data-edit-btn]")) {
      onEdit(task);
    }
  };

  return (
    <div ref={setNodeRef} style={style} onClick={handleEditClick}>
      <TaskCard
        task={task}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

export function TaskList({ onNewTask, onEdit }) {
  const { visibleTasks, sort, reorder, tasks } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find indices in the full tasks array
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    reorder(arrayMove([...tasks], oldIndex, newIndex));
  };

  if (visibleTasks.length === 0) {
    return <TaskEmpty onNewTask={onNewTask} />;
  }

  const isDndDisabled = sort !== "manual";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={isDndDisabled ? undefined : handleDragEnd}
    >
      <SortableContext
        items={visibleTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2.5 px-4 py-3">
          {isDndDisabled && (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-1">
              Switch to Manual Order to enable drag-and-drop reordering
            </p>
          )}
          <AnimatePresence initial={false}>
            {visibleTasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
