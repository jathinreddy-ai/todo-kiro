# Architecture & Code Flow

## Overview

Taskflow is a **single-page application (SPA)** built with React 19 + Vite. It has no server-side rendering. All UI logic runs in the browser. Data is stored in three layers simultaneously:

```
Browser localStorage  ←→  Supabase (PostgreSQL)  ←→  Firebase Firestore
     (offline)               (primary DB)            (realtime sync)
```

When credentials are not configured, the app runs entirely offline using localStorage.

---

## Provider Tree (Startup Order)

```
<StrictMode>
  <ThemeProvider>          ← dark/light mode, persisted to localStorage
    <UIProvider>           ← glass mode, gradient mode, accent color
      <AuthProvider>       ← Supabase auth (Google + email/password)
        <App>
          <TaskProvider>   ← task state, filter, sort, sync to backends
            <TaskApp>      ← all UI components
```

Each provider is independent. They are mounted in this order so inner providers can read from outer ones (e.g. `TaskProvider` receives `userId` from `AuthProvider` via `App`).

---

## Application Boot Sequence

```
1. Browser loads index.html
2. Vite serves src/main.jsx
3. React mounts provider tree (ThemeProvider → UIProvider → AuthProvider)
4. ThemeProvider reads localStorage → applies dark/light class to <html>
5. UIProvider reads localStorage → applies accent color CSS vars to :root
6. AuthProvider checks Supabase session → sets user state
7. App renders → passes user.id to TaskProvider
8. TaskProvider initialises:
   a. Reads tasks from localStorage (immediate, synchronous)
   b. If user is signed in + Supabase configured → fetches tasks from Supabase
   c. If Firebase configured → subscribes to Firestore realtime updates
   d. Seeds sample data if localStorage is empty
9. TaskApp renders Layout → Header → Sidebar → StatsPanel → FilterBar → TaskList
10. TaskList renders TaskCards via @dnd-kit SortableContext
```

---

## Data Flow

### Task Creation

```
User fills TaskForm
  → clicks "Create Task"
  → handleSubmit() validates title
  → addTask(payload) called from useTasks hook
  → dispatch({ type: 'ADD_TASK', payload })
  → taskReducer creates new task with nanoid() ID
  → React re-renders TaskList with new task
  → useEffect detects lastAction = { type: 'ADD', task }
  → syncTaskUpsert(task, userId) called
      → upsertTaskToSupabase(task, userId)   [async, non-blocking]
      → upsertTaskToFirestore(task, userId)  [async, non-blocking]
  → useEffect persists tasks to localStorage
  → toast.success('Task created') shown
```

### Task State Shape

```js
{
  id:          string,    // nanoid() — unique identifier
  title:       string,    // required
  description: string,    // optional
  priority:    'high' | 'medium' | 'low',
  categories:  string[],  // array of category IDs
  dueDate:     string | null,  // ISO date 'YYYY-MM-DD'
  completed:   boolean,
  createdAt:   string,    // ISO timestamp
  updatedAt:   string,    // ISO timestamp
  order:       number,    // manual drag-and-drop position
}
```

### Filter & Sort Pipeline

```
tasks (raw array from state)
  → filterTasks(tasks, filter)     ← status, category, priority
  → searchTasks(filtered, query)   ← title/description text search
  → sortTasks(searched, sort)      ← manual | priority | dueDate | createdAt | status
  = visibleTasks                   ← what TaskList renders
```

This pipeline runs inside a `useMemo` in `TaskContext`, so it only recomputes when `tasks`, `filter`, or `sort` changes.

---

## Component Hierarchy

```
App
├── TaskProvider (context)
└── TaskApp
    └── Layout
        ├── AppBackground (.app-bg — animated gradient mesh)
        ├── Sidebar
        │   ├── Logo + brand
        │   ├── New Task button
        │   ├── Nav items (All / Active / Completed / Due Today)
        │   └── Category list
        ├── Header
        │   ├── Hamburger (mobile)
        │   ├── SearchInput
        │   ├── GlassToggle
        │   ├── GradientToggle
        │   ├── ColorPicker
        │   │   └── CustomColorPicker (slide-in panel)
        │   ├── ThemeToggle
        │   └── Auth button → AuthModal
        └── main
            ├── StatsPanel
            │   └── 4× StatCard + progress bar
            ├── FilterBar (status / category / priority chips)
            ├── SortMenu (dropdown)
            └── TaskList (DndContext → SortableContext)
                ├── TaskCard × N
                └── TaskEmpty (when no tasks match)
```

---

## State Management Strategy

Taskflow uses **React's built-in state primitives** — no Redux, no Zustand.

| State                                   | Location             | Mechanism                        |
| --------------------------------------- | -------------------- | -------------------------------- |
| Task list, filter, sort                 | `TaskContext`        | `useReducer`                     |
| Dark/light theme                        | `ThemeContext`       | `useState` via `useLocalStorage` |
| Glass mode, gradient mode, accent color | `UIContext`          | `useState` via `useLocalStorage` |
| Auth user                               | `AuthContext`        | `useState` + Supabase listener   |
| Form open/edit state                    | `App` (local)        | `useState`                       |
| Sidebar open (mobile)                   | `Layout` (local)     | `useState`                       |
| Stats panel collapsed                   | `StatsPanel` (local) | `useState`                       |

---

## Persistence Strategy

```
Every state change
  ↓
useEffect in TaskContext
  ↓
localStorage.setItem('todo-app:tasks', JSON.stringify(tasks))
localStorage.setItem('todo-app:filter', JSON.stringify(filter))
localStorage.setItem('todo-app:sort', JSON.stringify(sort))

If user is signed in:
  ↓
syncTaskUpsert / syncTaskDelete
  ↓
Supabase upsert (primary)  +  Firestore setDoc (realtime mirror)
```

On page load, tasks are read from localStorage first (instant), then overwritten by Supabase data if the user is signed in (async).

---

## Realtime Sync Flow

```
Device A makes a change
  → writes to Supabase
  → writes to Firestore

Device B (same user, different tab/device)
  → Firestore onSnapshot listener fires
  → dispatch({ type: 'LOAD_TASKS', payload: remoteTasks })
  → UI updates instantly
```

---

## Keyboard Shortcut Flow

```
User presses key
  → document keydown listener (useKeyboardShortcuts hook)
  → checks if focus is in input/textarea (suppresses if so)
  → N or Ctrl+N → openNewTask()
  → /           → focus search input
  → Escape      → closeForm()
```

---

## Drag-and-Drop Flow

```
User grabs task card drag handle
  → @dnd-kit PointerSensor activates (after 8px movement)
  → DragOverlay shows ghost card
  → User drops on new position
  → onDragEnd fires
  → arrayMove(tasks, oldIndex, newIndex) computes new order
  → dispatch({ type: 'REORDER_TASKS', payload: reorderedTasks })
  → each task.order updated to its new index
  → persisted to localStorage + backends
```

Drag is disabled when sort !== 'manual'. A tooltip explains why.

---

## Theme System

```
ThemeContext
  → reads localStorage 'todo-app:theme'
  → falls back to prefers-color-scheme media query
  → toggles 'dark' class on <html>
  → Tailwind darkMode: 'class' picks it up
  → all dark: variants activate/deactivate
```

---

## UI Customization System

```
UIContext
  → glassMode: boolean
      → Layout passes to Sidebar, Header
      → Components switch between .glass and solid Tailwind classes
      → TaskCard switches between glass-card and solid-card

  → gradientMode: boolean
      → toggles 'gradient-mode' class on <html>
      → CSS rules in index.css respond to .gradient-mode selector
      → Buttons, nav items, chips, progress bar switch to gradient backgrounds

  → accentColor: string (preset ID or 'custom')
  → customHex: string (hex color for custom mode)
      → UIContext resolves to accent object { c400, c500, c600, c700, glow }
      → useAccentStyle() hook returns inline style objects
      → Components apply styles directly via style prop
      → Also writes CSS vars to :root for CSS-only elements (orbs, datepicker)
```
