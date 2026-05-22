// Global task state with useReducer.
//
// Storage strategy:
//   LOGGED IN  → tasks loaded from Supabase, cached in user-scoped localStorage key
//                mutations sync to Supabase + Firebase in real time
//   LOGGED OUT → empty task list (no cross-user data leakage)
//
// localStorage key is scoped per user: `todo-app:tasks:{userId}`
// so different users on the same browser never share task data.
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { nanoid } from "nanoid";
import { getVisibleTasks } from "../utils/taskHelpers";
import {
  fetchTasksFromSupabase,
  syncTaskUpsert,
  syncTaskDelete,
  subscribeToFirestoreTasks,
} from "../lib/taskSync";
import { isSupabaseConfigured } from "../lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_FILTER = {
  status: "all",
  category: null,
  priority: null,
  search: "",
};
const DEFAULT_SORT = "manual";

// User-scoped localStorage helpers — never mix data between users
function getUserKey(userId, key) {
  return `todo-app:${userId}:${key}`;
}

function readUserStorage(userId, key, fallback) {
  if (!userId) return fallback;
  try {
    const raw = localStorage.getItem(getUserKey(userId, key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeUserStorage(userId, key, value) {
  if (!userId) return;
  try {
    localStorage.setItem(getUserKey(userId, key), JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function taskReducer(state, action) {
  switch (action.type) {
    case "LOAD_TASKS":
      return { ...state, tasks: action.payload, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

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
  // Initial state depends on whether user is logged in
  const [state, dispatch] = useReducer(taskReducer, {
    // Logged out → empty list. Logged in → try user-scoped cache first.
    tasks: userId ? readUserStorage(userId, "tasks", null) || [] : [],
    filter: userId
      ? readUserStorage(userId, "filter", DEFAULT_FILTER)
      : DEFAULT_FILTER,
    sort: userId ? readUserStorage(userId, "sort", DEFAULT_SORT) : DEFAULT_SORT,
    isLoading: !!userId && isSupabaseConfigured,
    lastAction: null,
  });

  // Track previous userId to detect sign-in / sign-out transitions
  const prevUserIdRef = useRef(userId);

  // ── React to auth changes (sign-in / sign-out) ────────────────────────────
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (!userId) {
      // User signed out → clear task list immediately
      dispatch({ type: "LOAD_TASKS", payload: [] });
      return;
    }

    if (userId !== prevUserId) {
      // New user signed in → reset to their cached tasks while loading from Supabase
      const cached = readUserStorage(userId, "tasks", null);
      dispatch({ type: "LOAD_TASKS", payload: cached || [] });
    }

    if (!isSupabaseConfigured) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    // Fetch authoritative data from Supabase
    dispatch({ type: "SET_LOADING", payload: true });
    fetchTasksFromSupabase(userId).then((tasks) => {
      if (tasks !== null) {
        // Always trust Supabase as the source of truth
        dispatch({ type: "LOAD_TASKS", payload: tasks });
      } else {
        // Supabase unavailable — fall back to cache
        dispatch({ type: "SET_LOADING", payload: false });
      }
    });
  }, [userId]);

  // ── Firebase realtime subscription ───────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToFirestoreTasks(userId, (remoteTasks) => {
      // Only update if Firebase has data (avoids overwriting with empty on init)
      if (remoteTasks.length > 0) {
        dispatch({ type: "LOAD_TASKS", payload: remoteTasks });
      }
    });
    return unsub;
  }, [userId]);

  // ── Sync mutations to backends ────────────────────────────────────────────
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

  // ── Persist to user-scoped localStorage (only when logged in) ────────────
  useEffect(() => {
    if (userId) writeUserStorage(userId, "tasks", state.tasks);
  }, [state.tasks, userId]);

  useEffect(() => {
    if (userId) writeUserStorage(userId, "filter", state.filter);
  }, [state.filter, userId]);

  useEffect(() => {
    if (userId) writeUserStorage(userId, "sort", state.sort);
  }, [state.sort, userId]);

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

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        visibleTasks,
        filter: state.filter,
        sort: state.sort,
        isLoading: state.isLoading,
        stats,
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
}
