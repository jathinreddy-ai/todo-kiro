// Task sync layer — writes to Supabase (primary) and Firebase (realtime mirror).
// Falls back to localStorage-only when backends are not configured.
import { supabase, isSupabaseConfigured } from "./supabase";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

// ─── Supabase helpers ─────────────────────────────────────────────────────────

function toSupabaseRow(task, userId) {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    categories: task.categories || [],
    due_date: task.dueDate || null,
    completed: task.completed,
    order: task.order,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
  };
}

function fromSupabaseRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    priority: row.priority,
    categories: row.categories || [],
    dueDate: row.due_date || null,
    completed: row.completed,
    order: row.order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Supabase CRUD ────────────────────────────────────────────────────────────

export async function fetchTasksFromSupabase(userId) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("order", { ascending: true });
  if (error) {
    console.error("Supabase fetch error:", error);
    return null;
  }
  return data.map(fromSupabaseRow);
}

export async function upsertTaskToSupabase(task, userId) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("tasks")
    .upsert(toSupabaseRow(task, userId), { onConflict: "id" });
  if (error) console.error("Supabase upsert error:", error);
}

export async function deleteTaskFromSupabase(taskId) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) console.error("Supabase delete error:", error);
}

export async function upsertAllTasksToSupabase(tasks, userId) {
  if (!isSupabaseConfigured || !tasks.length) return;
  const rows = tasks.map((t) => toSupabaseRow(t, userId));
  const { error } = await supabase
    .from("tasks")
    .upsert(rows, { onConflict: "id" });
  if (error) console.error("Supabase bulk upsert error:", error);
}

// ─── Firebase Firestore helpers ───────────────────────────────────────────────

function firestoreTasksRef(userId) {
  return collection(db, "users", userId, "tasks");
}

export async function fetchTasksFromFirestore(userId) {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const snap = await getDocs(firestoreTasksRef(userId));
    return snap.docs.map((d) => d.data());
  } catch (e) {
    console.error("Firestore fetch error:", e);
    return null;
  }
}

export async function upsertTaskToFirestore(task, userId) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, "users", userId, "tasks", task.id);
    await setDoc(ref, task, { merge: true });
  } catch (e) {
    console.error("Firestore upsert error:", e);
  }
}

export async function deleteTaskFromFirestore(taskId, userId) {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, "users", userId, "tasks", taskId));
  } catch (e) {
    console.error("Firestore delete error:", e);
  }
}

// Subscribe to realtime Firestore updates. Returns unsubscribe function.
export function subscribeToFirestoreTasks(userId, onUpdate) {
  if (!isFirebaseConfigured || !db) return () => {};
  const ref = firestoreTasksRef(userId);
  return onSnapshot(
    ref,
    (snap) => {
      const tasks = snap.docs.map((d) => d.data());
      onUpdate(tasks);
    },
    (err) => {
      console.error("Firestore realtime error:", err);
    },
  );
}

// ─── Unified sync: write to both backends ─────────────────────────────────────

export async function syncTaskUpsert(task, userId) {
  await Promise.all([
    upsertTaskToSupabase(task, userId),
    upsertTaskToFirestore(task, userId),
  ]);
}

export async function syncTaskDelete(taskId, userId) {
  await Promise.all([
    deleteTaskFromSupabase(taskId),
    deleteTaskFromFirestore(taskId, userId),
  ]);
}
