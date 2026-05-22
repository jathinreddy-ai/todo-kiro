# Todo App — Technical Design

## Overview

A single-page application (SPA) built with **React 18 + Vite**, styled with **Tailwind CSS v3**, and animated with **Framer Motion**. All state is managed with React's built-in hooks (`useState`, `useReducer`, `useContext`) and persisted to `localStorage`. No backend, no authentication, no build-time server rendering.

---

## Tech Stack

| Layer       | Choice                                | Rationale                                          |
| ----------- | ------------------------------------- | -------------------------------------------------- |
| Framework   | React 18 + Vite                       | Fast HMR, modern JSX transform, no SSR complexity  |
| Styling     | Tailwind CSS v3                       | Utility-first, dark mode via `class` strategy, JIT |
| Animation   | Framer Motion                         | Declarative enter/exit animations, drag-and-drop   |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible, works with Framer Motion, no jQuery    |
| Icons       | `lucide-react`                        | Tree-shakeable, consistent stroke style            |
| Toasts      | `react-hot-toast`                     | Lightweight, accessible, customizable              |
| Date Picker | `react-datepicker`                    | Accessible, keyboard-navigable                     |
| Unique IDs  | `nanoid`                              | Tiny, URL-safe IDs for tasks                       |
| Language    | JavaScript (ES2022)                   | Per user preference                                |

---

## Folder Structure

```
todo-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── empty-state.svg          # Illustrated empty state
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Responsive sidebar nav
│   │   │   ├── Header.jsx            # Top bar with search + theme toggle
│   │   │   └── Layout.jsx            # Root layout wrapper
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx          # Individual task card
│   │   │   ├── TaskList.jsx          # Sortable list container
│   │   │   ├── TaskForm.jsx          # Create / edit modal form
│   │   │   └── TaskEmpty.jsx         # Empty state component
│   │   ├── dashboard/
│   │   │   └── StatsPanel.jsx        # Progress stats + bar
│   │   ├── ui/
│   │   │   ├── Button.jsx            # Reusable button variants
│   │   │   ├── Badge.jsx             # Priority / category badge
│   │   │   ├── Modal.jsx             # Accessible modal wrapper
│   │   │   ├── Skeleton.jsx          # Loading skeleton
│   │   │   ├── ThemeToggle.jsx       # Dark/light toggle button
│   │   │   └── SearchInput.jsx       # Debounced search field
│   │   └── filters/
│   │       ├── FilterBar.jsx         # Status / category / priority filters
│   │       └── SortMenu.jsx          # Sort dropdown
│   ├── context/
│   │   ├── TaskContext.jsx           # Global task state + actions
│   │   └── ThemeContext.jsx          # Dark/light mode state
│   ├── hooks/
│   │   ├── useTasks.js               # Convenience hook for TaskContext
│   │   ├── useLocalStorage.js        # Generic localStorage sync hook
│   │   ├── useKeyboardShortcuts.js   # Global keyboard shortcut handler
│   │   └── useReminders.js           # Due-date notification scheduler
│   ├── utils/
│   │   ├── taskHelpers.js            # Filter, sort, search utilities
│   │   ├── sampleData.js             # Demo tasks seed data
│   │   └── constants.js              # Priority levels, default categories
│   ├── App.jsx                       # Root component, router-free SPA
│   ├── main.jsx                      # Vite entry point
│   └── index.css                     # Tailwind directives + custom CSS vars
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## State Architecture

### TaskContext

Holds the single source of truth for all task data.

```js
// State shape
{
  tasks: Task[],          // ordered array (manual drag order)
  filter: {
    status: 'all' | 'active' | 'completed',
    category: string | null,
    priority: 'high' | 'medium' | 'low' | null,
    search: string,
  },
  sort: 'manual' | 'priority' | 'dueDate' | 'createdAt' | 'status',
  isLoading: boolean,
}
```

**Task shape:**

```js
{
  id: string,             // nanoid()
  title: string,
  description: string,
  priority: 'high' | 'medium' | 'low',
  categories: string[],   // category IDs
  dueDate: string | null, // ISO date string
  completed: boolean,
  createdAt: string,      // ISO timestamp
  updatedAt: string,
  order: number,          // for manual sort
}
```

**Actions (useReducer):**

- `ADD_TASK`
- `UPDATE_TASK`
- `DELETE_TASK`
- `TOGGLE_COMPLETE`
- `REORDER_TASKS`
- `SET_FILTER`
- `SET_SORT`
- `LOAD_TASKS`

### ThemeContext

```js
{
  theme: 'dark' | 'light',
  toggleTheme: () => void,
}
```

On mount, reads `localStorage.theme` → falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. Applies `dark` class to `<html>` element.

---

## Component Design

### Layout.jsx

```
<div class="flex h-screen overflow-hidden">
  <Sidebar />                    // fixed left panel (desktop) / drawer (mobile)
  <main class="flex-1 overflow-y-auto">
    <Header />                   // sticky top bar
    <StatsPanel />               // collapsible dashboard
    <FilterBar />                // filter + sort controls
    <TaskList />                 // sortable task cards
  </main>
</div>
```

### TaskCard.jsx

Rendered inside `@dnd-kit/sortable`'s `SortableItem` wrapper.

Key visual elements:

- Left color bar indicating priority (red / amber / green)
- Category badges (colored pills)
- Due date chip (warning color if overdue)
- Completion checkbox with animated checkmark
- Hover: scale(1.01), elevated shadow
- Action buttons (edit, delete) revealed on hover / focus

Framer Motion variants:

```js
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -40, scale: 0.95 },
};
```

### TaskForm.jsx (Modal)

Fields: Title (required), Description, Priority (radio/select), Categories (multi-select chips), Due Date (date picker).

Validation: title must be non-empty. Shows inline error on blur/submit.

Keyboard: `Escape` closes, `Enter` submits (when focus is not in textarea).

### StatsPanel.jsx

Displays four stat cards (Total, Active, Completed, % Done) and an animated progress bar.

Progress bar uses Framer Motion `animate={{ width: `${pct}%` }}` with spring transition.

### FilterBar.jsx

Horizontal scrollable chip row on mobile, full row on desktop.

Chips: All / Active / Completed | category chips | priority chips.

Active chip: filled background. Inactive: outlined.

### Sidebar.jsx

Desktop (≥ 1024 px): fixed 240 px wide panel with nav links (All Tasks, Today, Upcoming, Completed) and category list.

Mobile (< 1024 px): off-canvas drawer, slides in from left via Framer Motion `x: -240 → 0`. Backdrop overlay closes on click.

---

## Drag-and-Drop

Uses `@dnd-kit/core` with `@dnd-kit/sortable`:

```jsx
<DndContext
  onDragEnd={handleDragEnd}
  sensors={sensors}
  collisionDetection={closestCenter}
>
  <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
    {tasks.map((task) => (
      <SortableTaskCard key={task.id} task={task} />
    ))}
  </SortableContext>
</DndContext>
```

`handleDragEnd` dispatches `REORDER_TASKS` with the new order computed via `arrayMove`.

Drag is disabled when `sort !== 'manual'` — a tooltip explains why.

---

## Local Storage Strategy

`useLocalStorage` hook wraps `useState` with a `useEffect` that serializes to JSON on every state change.

Keys:

- `todo-app:tasks` — task array
- `todo-app:theme` — `'dark'` | `'light'`
- `todo-app:filter` — last active filter state
- `todo-app:sort` — last active sort

On first load, if `todo-app:tasks` is absent or empty, `sampleData.js` seeds 8 demo tasks across different priorities and categories.

---

## Keyboard Shortcuts

Implemented in `useKeyboardShortcuts.js` via a `keydown` event listener on `document`.

| Shortcut | Action                  |
| -------- | ----------------------- |
| `N`      | Open new task form      |
| `Ctrl+N` | Open new task form      |
| `/`      | Focus search input      |
| `Escape` | Close open modal / form |

Shortcuts are suppressed when focus is inside an `<input>`, `<textarea>`, or `[contenteditable]`.

---

## Reminder Notifications

`useReminders.js` runs a `setInterval` every 60 seconds. For each incomplete task with a due date:

- If due date is within 24 hours → request `Notification` permission (once) and fire a browser notification.
- Notifications are deduplicated using a `Set` of already-notified task IDs stored in a ref.

---

## Visual Design System

### Color Palette (Tailwind custom tokens)

```js
// tailwind.config.js
colors: {
  brand: {
    50:  '#f0f4ff',
    500: '#6366f1',   // indigo accent
    600: '#4f46e5',
    900: '#1e1b4b',
  },
  priority: {
    high:   '#ef4444',  // red-500
    medium: '#f59e0b',  // amber-500
    low:    '#22c55e',  // green-500
  },
}
```

### Dark Mode

Tailwind `darkMode: 'class'`. Dark backgrounds use `slate-900` / `slate-800`. Cards use `slate-800/60` with `backdrop-blur-md` for glassmorphism.

### Typography

- Font: `Inter` (Google Fonts, variable font)
- Headings: `font-semibold tracking-tight`
- Body: `font-normal text-slate-700 dark:text-slate-300`

### Glassmorphism Cards

```css
.glass-card {
  @apply bg-white/70 dark:bg-slate-800/60
         backdrop-blur-md
         border border-white/20 dark:border-slate-700/50
         rounded-2xl shadow-lg;
}
```

---

## Performance Considerations

- `useMemo` for filtered + sorted task list to avoid recomputation on unrelated renders.
- `useCallback` for dispatch wrappers passed as props.
- Framer Motion `AnimatePresence` wraps the task list for enter/exit animations without layout thrash.
- `React.memo` on `TaskCard` to prevent re-renders when sibling tasks change.
- Debounce (300 ms) on search input via a local `useState` + `useEffect`.

---

## Accessibility

- All modals use `role="dialog"` with `aria-modal="true"` and focus trap.
- Toast container uses `role="status"` and `aria-live="polite"`.
- Drag handles have `aria-roledescription="sortable"` and keyboard instructions.
- Color is never the sole indicator of meaning (priority also shown via text label).
- Focus ring: `focus-visible:ring-2 focus-visible:ring-brand-500`.

---

## Setup Instructions

```bash
# 1. Navigate to project directory
cd todo-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

Dependencies to install:

```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npm install framer-motion @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react react-hot-toast react-datepicker nanoid
npx tailwindcss init -p
```
