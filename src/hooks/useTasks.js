// Convenience hook — re-exports everything from TaskContext with action helpers.
import { useCallback } from "react";
import { useTaskContext } from "../context/TaskContext";

export function useTasks() {
  const { tasks, visibleTasks, filter, sort, isLoading, stats, dispatch } =
    useTaskContext();

  const addTask = useCallback(
    (data) => dispatch({ type: "ADD_TASK", payload: data }),
    [dispatch],
  );
  const updateTask = useCallback(
    (data) => dispatch({ type: "UPDATE_TASK", payload: data }),
    [dispatch],
  );
  const deleteTask = useCallback(
    (id) => dispatch({ type: "DELETE_TASK", payload: id }),
    [dispatch],
  );
  const toggleTask = useCallback(
    (id) => dispatch({ type: "TOGGLE_COMPLETE", payload: id }),
    [dispatch],
  );
  const reorder = useCallback(
    (tasks) => dispatch({ type: "REORDER_TASKS", payload: tasks }),
    [dispatch],
  );
  const setFilter = useCallback(
    (patch) => dispatch({ type: "SET_FILTER", payload: patch }),
    [dispatch],
  );
  const setSort = useCallback(
    (sort) => dispatch({ type: "SET_SORT", payload: sort }),
    [dispatch],
  );

  return {
    tasks,
    visibleTasks,
    filter,
    sort,
    isLoading,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorder,
    setFilter,
    setSort,
  };
}
