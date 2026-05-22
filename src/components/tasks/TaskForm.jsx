// Create / edit task modal form with validation.
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { PRIORITIES, DEFAULT_CATEGORIES } from "../../utils/constants";
import { useTasks } from "../../hooks/useTasks";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium",
  categories: [],
  dueDate: null,
};

export function TaskForm({ isOpen, onClose, editTask = null }) {
  const { addTask, updateTask } = useTasks();
  const [form, setForm] = useState(EMPTY_FORM);
  const [titleError, setTitleError] = useState("");

  // Pre-populate when editing
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description || "",
        priority: editTask.priority,
        categories: editTask.categories || [],
        dueDate: editTask.dueDate ? new Date(editTask.dueDate) : null,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTitleError("");
  }, [editTask, isOpen]);

  const handleTitleBlur = () => {
    if (!form.title.trim()) setTitleError("Title is required");
    else setTitleError("");
  };

  const toggleCategory = (catId) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(catId)
        ? f.categories.filter((c) => c !== catId)
        : [...f.categories, catId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setTitleError("Title is required");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate ? form.dueDate.toISOString().split("T")[0] : null,
    };

    if (editTask) {
      updateTask({ ...payload, id: editTask.id });
      toast.success("Task updated");
    } else {
      addTask(payload);
      toast.success("Task created");
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTask ? "Edit Task" : "New Task"}
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Title{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              setTitleError("");
            }}
            onBlur={handleTitleBlur}
            placeholder="What needs to be done?"
            aria-required="true"
            aria-describedby={titleError ? "title-error" : undefined}
            aria-invalid={!!titleError}
            className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-500 ${
              titleError
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-200 dark:border-slate-700"
            }`}
          />
          {titleError && (
            <p
              id="title-error"
              role="alert"
              className="mt-1 text-xs text-red-500"
            >
              {titleError}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="task-desc"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="task-desc"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Add details (optional)"
            rows={3}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </p>
          <div className="flex gap-2" role="group" aria-label="Task priority">
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, priority: p.id }))}
                aria-pressed={form.priority === p.id}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  form.priority === p.id
                    ? `${p.bgClass} ${p.textClass} border-current`
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Categories
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Task categories"
          >
            {DEFAULT_CATEGORIES.map((cat) => {
              const selected = form.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    selected
                      ? `${cat.bgClass} ${cat.textClass} border-current`
                      : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label
            htmlFor="task-due"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Due Date
          </label>
          <DatePicker
            id="task-due"
            selected={form.dueDate}
            onChange={(date) => setForm((f) => ({ ...f, dueDate: date }))}
            placeholderText="Pick a date (optional)"
            dateFormat="MMM d, yyyy"
            minDate={new Date()}
            isClearable
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-500"
            wrapperClassName="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            {editTask ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
