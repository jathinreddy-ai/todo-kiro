# Todo App — Implementation Tasks

## Task Dependency Graph

```
T1 (Project Setup)
  └── T2 (Tailwind + Theme)
        └── T3 (Context + Storage)
              ├── T4 (Sample Data + Constants)
              ├── T5 (UI Primitives)
              │     └── T6 (Layout + Sidebar)
              │           └── T7 (Header + Search)
              │                 └── T8 (Filter + Sort Bar)
              │                       └── T9 (Stats Dashboard)
              │                             └── T10 (Task Form Modal)
              │                                   └── T11 (Task Card)
              │                                         └── T12 (Task List + DnD)
              │                                               └── T13 (Animations)
              │                                                     └── T14 (Keyboard + Reminders)
              │                                                           └── T15 (Accessibility Audit)
              │                                                                 └── T16 (Polish + Demo)
              └── T4
```

---

## Tasks

- [x] **Task 1: Project Scaffolding**
      Initialize the Vite + React project, install all dependencies, and configure the base toolchain.

  **Steps:**
  1. Run `npm create vite@latest todo-app -- --template react` in the workspace root.
  2. Install runtime dependencies: `framer-motion @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react react-hot-toast react-datepicker nanoid`.
  3. Install dev dependencies: `tailwindcss postcss autoprefixer`.
  4. Run `npx tailwindcss init -p` to generate `tailwind.config.js` and `postcss.config.js`.
  5. Create the full folder structure under `src/` as defined in the design doc (components, context, hooks, utils, assets).
  6. Add `Inter` font via Google Fonts import in `index.html`.
  7. Verify `npm run dev` starts without errors.

---

- [x] **Task 2: Tailwind Configuration and Design Tokens**
      Configure Tailwind with custom color tokens, dark mode strategy, and global CSS variables.

  **Steps:**
  1. Set `darkMode: 'class'` in `tailwind.config.js`.
  2. Add `content` paths covering all `src/**/*.{js,jsx}` files.
  3. Add custom `colors` for `brand` (indigo scale) and `priority` (high/medium/low) as defined in the design doc.
  4. Add `fontFamily.sans` pointing to `['Inter', 'sans-serif']`.
  5. In `src/index.css`, add Tailwind directives (`@tailwind base/components/utilities`).
  6. Define `.glass-card` utility class using `@apply` for glassmorphism styles.
  7. Add CSS custom properties for smooth theme transitions (`transition: background-color 300ms, color 300ms`).

---

- [x] **Task 3: Theme Context and Local Storage Hook**
      Implement dark/light mode context and the generic `useLocalStorage` hook.

  **Steps:**
  1. Create `src/hooks/useLocalStorage.js` — a hook that wraps `useState` and syncs to `localStorage` with JSON serialization; handles `localStorage` unavailability gracefully.
  2. Create `src/context/ThemeContext.jsx` — provides `theme` and `toggleTheme`; reads `localStorage.theme` on mount, falls back to `prefers-color-scheme`; applies/removes `dark` class on `<html>`.
  3. Wrap `<App />` in `<ThemeProvider>` in `main.jsx`.
  4. Write a quick smoke test by toggling theme and verifying the `dark` class on `<html>`.

---

- [x] **Task 4: Constants, Sample Data, and Task Utilities**
      Define shared constants, seed demo tasks, and implement filter/sort/search utility functions.

  **Steps:**
  1. Create `src/utils/constants.js` — export `PRIORITIES` array (`high`, `medium`, `low`) with labels and colors; export `DEFAULT_CATEGORIES` array (Work, Personal, Shopping, Health, Learning) each with a unique color hex.
  2. Create `src/utils/sampleData.js` — export an array of 8 realistic demo tasks covering all priorities, multiple categories, some with due dates (past, today, future), some completed.
  3. Create `src/utils/taskHelpers.js` — export pure functions: `filterTasks(tasks, filter)`, `sortTasks(tasks, sort)`, `searchTasks(tasks, query)`. Compose them in a `getVisibleTasks(tasks, filter, sort)` function.
  4. Unit-test `getVisibleTasks` with at least 5 cases (empty list, all filters active, sort by priority, search match, no match).

---

- [x] **Task 5: Task Context and Reducer**
      Implement the global task state with `useReducer`, all action handlers, and local storage persistence.

  **Steps:**
  1. Create `src/context/TaskContext.jsx` with the state shape from the design doc.
  2. Implement the reducer handling: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `TOGGLE_COMPLETE`, `REORDER_TASKS`, `SET_FILTER`, `SET_SORT`, `LOAD_TASKS`.
  3. On mount, load tasks from `localStorage` (`todo-app:tasks`); if absent/empty, seed with `sampleData`.
  4. On every state change, persist `tasks`, `filter`, and `sort` to their respective `localStorage` keys.
  5. Create `src/hooks/useTasks.js` — a convenience hook that reads from `TaskContext` and throws if used outside the provider.
  6. Wrap `<App />` in `<TaskProvider>` in `main.jsx` (inside `<ThemeProvider>`).

---

- [ ] **Task 6: Reusable UI Primitives**
      Build the shared UI component library used throughout the app.

  **Steps:**
  1. `Button.jsx` — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; includes `disabled` and `loading` states; uses Framer Motion `whileHover` and `whileTap`.
  2. `Badge.jsx` — renders a colored pill for priority or category; accepts `color` and `label` props.
  3. `Modal.jsx` — accessible dialog with focus trap (`Tab` cycles within), `Escape` closes, backdrop click closes; uses Framer Motion for enter/exit; sets `aria-modal`, `role="dialog"`, `aria-labelledby`.
  4. `Skeleton.jsx` — renders animated shimmer placeholder cards for loading state.
  5. `ThemeToggle.jsx` — icon button (sun/moon) that calls `toggleTheme`; animates icon swap with Framer Motion `AnimatePresence`.
  6. `SearchInput.jsx` — controlled input with debounce (300 ms); magnifier icon; clear button when non-empty; dispatches `SET_FILTER` with updated search string.

---

- [ ] **Task 7: Sidebar Navigation**
      Build the responsive sidebar with desktop persistent panel and mobile off-canvas drawer.

  **Steps:**
  1. Create `src/components/layout/Sidebar.jsx`.
  2. Desktop (≥ 1024 px): fixed 240 px left panel with nav links (All Tasks, Today, Upcoming, Completed) and a category list with color dots.
  3. Mobile (< 1024 px): off-canvas drawer; slides in from left via Framer Motion `x` animation; backdrop overlay with `onClick` to close.
  4. Each nav link dispatches the appropriate `SET_FILTER` action when clicked and shows an active state.
  5. Category list renders `DEFAULT_CATEGORIES` plus any user-created categories; clicking one sets the category filter.
  6. Add a "New Task" button at the bottom of the sidebar.

---

- [ ] **Task 8: Header and Top Bar**
      Build the sticky header with the app title, search input, and theme toggle.

  **Steps:**
  1. Create `src/components/layout/Header.jsx`.
  2. Left: hamburger menu button (mobile only) that toggles sidebar; app logo/title.
  3. Center: `SearchInput` component wired to `SET_FILTER` search.
  4. Right: `ThemeToggle` button; keyboard shortcut hint badge.
  5. Apply glassmorphism styling (`backdrop-blur`, semi-transparent background) so content scrolls behind it.
  6. Create `src/components/layout/Layout.jsx` composing `Sidebar`, `Header`, and `<main>` slot.

---

- [ ] **Task 9: Filter Bar and Sort Menu**
      Build the horizontal filter chip row and sort dropdown.

  **Steps:**
  1. Create `src/components/filters/FilterBar.jsx` — renders status chips (All / Active / Completed), category chips, and priority chips; active chip has filled style; dispatches `SET_FILTER`.
  2. Create `src/components/filters/SortMenu.jsx` — dropdown/select with options: Manual Order, Priority, Due Date, Created Date, Status; dispatches `SET_SORT`; when sort ≠ manual, shows a tooltip on the drag handle explaining DnD is disabled.
  3. On mobile, `FilterBar` scrolls horizontally with hidden scrollbar.
  4. Add a "Clear Filters" button that resets all filters to defaults.

---

- [ ] **Task 10: Progress Statistics Dashboard**
      Build the collapsible stats panel with animated progress bar.

  **Steps:**
  1. Create `src/components/dashboard/StatsPanel.jsx`.
  2. Compute stats from `getVisibleTasks` output: total, completed, active, percentage.
  3. Render four stat cards (Total, Active, Completed, % Done) with icons from `lucide-react`.
  4. Animated progress bar: Framer Motion `animate={{ width: \`${pct}%\` }}` with spring transition.
  5. When `pct === 100`, show a confetti/celebration micro-animation and congratulatory message.
  6. Panel is collapsible (toggle button); collapsed state persisted to `localStorage`.

---

- [ ] **Task 11: Task Form Modal**
      Build the create/edit task modal with full validation.

  **Steps:**
  1. Create `src/components/tasks/TaskForm.jsx`.
  2. Fields: Title (text input, required), Description (textarea, optional), Priority (segmented control: High / Medium / Low), Categories (multi-select chip picker), Due Date (`react-datepicker`).
  3. Validation: title must be non-empty; show inline error message on blur and on submit attempt.
  4. On submit: dispatch `ADD_TASK` or `UPDATE_TASK`; close modal; fire success toast.
  5. On cancel / `Escape`: close modal without saving.
  6. Wrap in `Modal.jsx`; animate in/out with Framer Motion.
  7. Pre-populate all fields when editing an existing task.

---

- [ ] **Task 12: Task Card Component**
      Build the individual task card with all visual indicators and action buttons.

  **Steps:**
  1. Create `src/components/tasks/TaskCard.jsx`.
  2. Left color bar: 4 px wide, color from `priority` tokens.
  3. Completion checkbox: custom animated checkmark (Framer Motion path draw animation).
  4. Title: strike-through + muted color when completed.
  5. Category badges: `Badge` components for each assigned category.
  6. Due date chip: shows formatted date; red/amber if overdue or due today.
  7. Priority badge: colored label.
  8. Action buttons (edit pencil, delete trash): visible on hover/focus; delete triggers confirmation via a small inline popover (not a full modal).
  9. Hover effect: `scale(1.01)`, elevated shadow via Framer Motion `whileHover`.
  10. Apply `React.memo` to prevent unnecessary re-renders.

---

- [ ] **Task 13: Task List with Drag-and-Drop**
      Build the sortable task list container integrating `@dnd-kit`.

  **Steps:**
  1. Create `src/components/tasks/TaskList.jsx`.
  2. Wrap with `DndContext` (sensors: pointer + keyboard), `SortableContext` (vertical list strategy).
  3. Each task rendered as a `SortableItem` wrapping `TaskCard`; drag handle is a grip icon.
  4. `onDragEnd`: compute new order with `arrayMove`, dispatch `REORDER_TASKS`.
  5. Disable drag handles (pointer-events: none, opacity: 0.4) when `sort !== 'manual'`.
  6. Wrap list in Framer Motion `AnimatePresence` for enter/exit animations using `cardVariants`.
  7. Create `src/components/tasks/TaskEmpty.jsx` — illustrated empty state with SVG and friendly message; shown when visible task list is empty.

---

- [ ] **Task 14: Toast Notifications**
      Wire up `react-hot-toast` for all user action feedback.

  **Steps:**
  1. Add `<Toaster>` to `App.jsx` with custom styles matching the app's design tokens (dark/light aware).
  2. Fire toasts for: task created (success), task updated (success), task deleted (error/warning), task completed (success with checkmark), local storage unavailable (warning).
  3. Toast container uses `role="status"` and `aria-live="polite"` (verify `react-hot-toast` default or add wrapper).
  4. Auto-dismiss after 3 seconds; allow manual dismiss.

---

- [ ] **Task 15: Keyboard Shortcuts and Reminders**
      Implement global keyboard shortcuts and due-date browser notifications.

  **Steps:**
  1. Create `src/hooks/useKeyboardShortcuts.js` — attach `keydown` listener on `document`; suppress when focus is in `input`, `textarea`, or `[contenteditable]`; handle: `N`/`Ctrl+N` → open new task form, `/` → focus search, `Escape` → close modal.
  2. Call `useKeyboardShortcuts` in `App.jsx`.
  3. Create `src/hooks/useReminders.js` — `setInterval` every 60 s; for each incomplete task with due date within 24 h, request `Notification` permission once and fire a browser notification; deduplicate with a `useRef` Set.
  4. Call `useReminders` in `App.jsx`.
  5. Add a keyboard shortcut legend (small `?` button in header that opens a modal listing all shortcuts).

---

- [ ] **Task 16: Accessibility Audit and Focus Management**
      Ensure the app meets WCAG AA and is fully keyboard-navigable.

  **Steps:**
  1. Audit all interactive elements for visible `focus-visible` rings (`focus-visible:ring-2 focus-visible:ring-brand-500`).
  2. Verify all icons have `aria-label` or are `aria-hidden` with adjacent visible text.
  3. Verify `Modal.jsx` focus trap works correctly (Tab cycles, Shift+Tab reverses, focus returns to trigger on close).
  4. Verify drag-and-drop keyboard support: `@dnd-kit` keyboard sensor allows Space to pick up, arrow keys to move, Space/Enter to drop.
  5. Run axe-core (via browser extension or `@axe-core/react`) and resolve all critical/serious violations.
  6. Verify color contrast for all text/background combinations in both light and dark mode.

---

- [ ] **Task 17: Final Polish, Performance, and Demo**
      Apply finishing touches, optimize performance, and verify the full feature set.

  **Steps:**
  1. Add `useMemo` to `getVisibleTasks` call in `TaskContext` or consuming component.
  2. Add `useCallback` to all dispatch wrappers passed as props.
  3. Verify `React.memo` on `TaskCard` prevents re-renders when unrelated tasks change.
  4. Add skeleton loading state: on initial mount, show `Skeleton` cards for 400 ms before rendering real tasks (simulates async load feel).
  5. Test all 11 requirements end-to-end manually on desktop, tablet (768 px), and mobile (375 px) viewports.
  6. Verify sample dummy tasks appear on first load (empty `localStorage`).
  7. Run `npm run build` and verify zero build errors; check bundle size.
  8. Write a concise `README.md` with setup instructions, feature list, and keyboard shortcut reference.
