// Global task state with useReducer.
// Storage priority: Supabase (primary) → Firebase (realtime) → localStorage (offline fallback).
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SAMPLE_TASKS } from "../utils/sampleData";
import { getVisibleTasks } from "../utils/taskHelpers";
import {
  fetchTasksFromSupabase,
  upsertAllTasksToSupabase,
  syncTaskUpsert,
  syncTaskDelete,
  subscribeToFirestoreTasks,
} from "../lib/taskSync";
import { isSupabaseConfigured } from "../lib/supabase";

// ─── Initial State ────────────────────────────────────────────────────────────
const DEFAULT_FILTER = {
  status: "all",
  category: null,
  priority: null,
  search: "",
};
const DEFAULT_SORT = "manual";

// ─── Reducer ──────────────────────────────────────────────────────────────────
function taskReducer(state, action) {
  switch (action.type) {
    case "LOAD_TASKS":
      return { ...state, tasks: action.payload, isLoading: false };

    case "ADD_TASK": {
      const newTask = {
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description || "",
        priority: action.payload.priority || "medium",
        categories: action.payload.categories || [],
        dueDate: action.payload.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: state.tasks.length,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        lastAction: { type: "ADD", task: newTask },
      };
    }

    case "UPDATE_TASK": {
      const updated = state.tasks.map((t) =>
        t.id === action.payload.id
          ? { ...t, ...action.payload, updatedAt: new Date().toISOString() }
          : t,
      );
      const task = updated.find((t) => t.id === action.payload.id);
      return { ...state, tasks: updated, lastAction: { type: "UPDATE", task } };
    }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        lastAction: { type: "DELETE", taskId: action.payload },
      };

    case "TOGGLE_COMPLETE": {
      const toggled = state.tasks.map((t) =>
        t.id === action.payload
          ? {
              ...t,
              completed: !t.completed,
              updatedAt: new Date().toISOString(),
            }
          : t,
      );
      const task = toggled.find((t) => t.id === action.payload);
      return { ...state, tasks: toggled, lastAction: { type: "UPDATE", task } };
    }

    case "REORDER_TASKS": {
      const reordered = action.payload.map((t, i) => ({ ...t, order: i }));
      return {
        ...state,
        tasks: reordered,
        lastAction: { type: "REORDER", tasks: reordered },
      };
    }

    case "SET_FILTER":
      return { ...state, filter: { ...state.filter, ...action.payload } };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "CLEAR_LAST_ACTION":
      return { ...state, lastAction: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TaskContext = createContext(null);

export function TaskProvider({ children, userId }) {
  const [savedTasks, setSavedTasks] = useLocalStorage("todo-app:tasks", null);
  const [savedFilter, setSavedFilter] = useLocalStorage(
    "todo-app:filter",
    DEFAULT_FILTER,
  );
  const [savedSort, setSavedSort] = useLocalStorage(
    "todo-app:sort",
    DEFAULT_SORT,
  );

  const [state, dispatch] = useReducer(taskReducer, {
    tasks: savedTasks && savedTasks.length > 0 ? savedTasks : SAMPLE_TASKS,
    filter: savedFilter || DEFAULT_FILTER,
    sort: savedSort || DEFAULT_SORT,
    isLoading: !!userId && isSupabaseConfigured,
    lastAction: null,
  });

  // ── Load tasks from Supabase on sign-in ──────────────────────────────────
  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;

    fetchTasksFromSupabase(userId).then((tasks) => {
      if (tasks && tasks.length > 0) {
        dispatch({ type: "LOAD_TASKS", payload: tasks });
      } else if (tasks !== null) {
        // Signed in but no cloud tasks yet — seed from localStorage
        const local =
          savedTasks && savedTasks.length > 0 ? savedTasks : SAMPLE_TASKS;
        dispatch({ type: "LOAD_TASKS", payload: local });
        upsertAllTasksToSupabase(local, userId);
      } else {
        dispatch({ type: "LOAD_TASKS", payload: state.tasks });
      }
    });
  }, [userId]);

  // ── Firebase realtime subscription ───────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToFirestoreTasks(userId, (remoteTasks) => {
      if (remoteTasks.length > 0) {
        dispatch({ type: "LOAD_TASKS", payload: remoteTasks });
      }
    });
    return unsub;
  }, [userId]);

  // ── Sync lastAction to backends ───────────────────────────────────────────
  useEffect(() => {
    if (!state.lastAction || !userId) return;
    const { type, task, taskId, tasks } = state.lastAction;

    if (type === "ADD" || type === "UPDATE") {
      syncTaskUpsert(task, userId);
    } else if (type === "DELETE") {
      syncTaskDelete(taskId, userId);
    } else if (type === "REORDER") {
      tasks.forEach((t) => syncTaskUpsert(t, userId));
    }

    dispatch({ type: "CLEAR_LAST_ACTION" });
  }, [state.lastAction, userId]);

  // ── Persist to localStorage ───────────────────────────────────────────────
  useEffect(() => {
    setSavedTasks(state.tasks);
  }, [state.tasks]);
  useEffect(() => {
    setSavedFilter(state.filter);
  }, [state.filter]);
  useEffect(() => {
    setSavedSort(state.sort);
  }, [state.sort]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const visibleTasks = useMemo(
    () => getVisibleTasks(state.tasks, state.filter, state.sort),
    [state.tasks, state.filter, state.sort],
  );

  const stats = useMemo(() => {
    const total = visibleTasks.length;
    const completed = visibleTasks.filter((t) => t.completed).length;
    const active = total - completed;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, pct };
  }, [visibleTasks]);

  const value = {
    tasks: state.tasks,
    visibleTasks,
    filter: state.filter,
    sort: state.sort,
    isLoading: state.isLoading,
    stats,
    dispatch,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
}
