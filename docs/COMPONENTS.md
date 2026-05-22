# Component Reference

Complete reference for every file in `src/`. Organized by directory.

---

## Entry Points

### `src/main.jsx`

The Vite entry point. Mounts the React app into `#root`.

**Responsibility**: Wraps `<App>` in the full provider tree in the correct order:

```
ThemeProvider → UIProvider → AuthProvider → App
```

### `src/App.jsx`

Root application component. Split into two parts:

- **`App()`** — reads `user` from `AuthContext`, passes `user.id` to `TaskProvider`
- **`TaskApp()`** — inner component that can access `TaskContext`. Manages form open/close state, wires keyboard shortcuts and reminders, renders the full page layout

**Key state**:

- `formOpen: boolean` — whether the task create/edit modal is open
- `editTask: Task | null` — the task being edited (null = create mode)

---

## Contexts (`src/context/`)

### `ThemeContext.jsx`

Manages dark/light mode.

**State**: `theme: 'dark' | 'light'`

**Behavior**:

- On mount: reads `localStorage['todo-app:theme']`, falls back to `prefers-color-scheme`
- On change: adds/removes `dark` class on `<html>`
- Persisted via `useLocalStorage`

**Exports**: `ThemeProvider`, `useTheme()`

---

### `UIContext.jsx`

Manages all visual customization preferences.

**State**:

- `glassMode: boolean` — glass vs solid card surfaces
- `gradientMode: boolean` — gradient vs flat accent colors
- `accentColor: string` — preset color ID or `'custom'`
- `customHex: string` — hex value when using custom color

**Key function `resolveAccent(accentColor, customHex)`**:
Returns `{ c400, c500, c600, c700, glow, glowStrong }` — the resolved color palette used by `useAccentStyle`.

**Key function `buildCustomVars(rawHex)`**:
Generates a full shade scale from a single hex color by blending toward white (lighten) and black (darken).

**`applyCustomColor(hex)`**:
Normalises the hex, updates `customHex` and `accentColor` state, and writes CSS vars to `:root`.

**Exports**: `UIProvider`, `useUI()`, `ACCENT_COLORS`, `buildCustomVars`

---

### `TaskContext.jsx`

Global task state. The most complex context in the app.

**State shape**:

```js
{
  tasks: Task[],
  filter: { status, category, priority, search },
  sort: string,
  isLoading: boolean,
  lastAction: object | null,
}
```

**Reducer actions**:
| Action | Effect |
|---|---|
| `ADD_TASK` | Appends new task with nanoid ID |
| `UPDATE_TASK` | Merges payload into matching task |
| `DELETE_TASK` | Removes task by ID |
| `TOGGLE_COMPLETE` | Flips `completed` boolean |
| `REORDER_TASKS` | Replaces task array, updates `order` fields |
| `SET_FILTER` | Merges filter patch |
| `SET_SORT` | Replaces sort value |
| `LOAD_TASKS` | Replaces entire task array (from backend) |
| `CLEAR_LAST_ACTION` | Resets `lastAction` after sync |

**Derived state** (memoized):

- `visibleTasks` — filtered + searched + sorted task list
- `stats` — `{ total, completed, active, pct }`

**Backend sync**: A `useEffect` watches `lastAction` and calls `syncTaskUpsert` or `syncTaskDelete` from `taskSync.js`.

**Exports**: `TaskProvider`, `useTaskContext()`

---

### `AuthContext.jsx`

Wraps Supabase authentication.

**State**: `user: User | null`, `loading: boolean`

**Methods**: `signInWithGoogle()`, `signInWithEmail()`, `signUpWithEmail()`, `signOut()`

**Behavior**: When Supabase is not configured (placeholder credentials), all auth methods return an error message and the app works in offline mode.

**Exports**: `AuthProvider`, `useAuth()`

---

## Hooks (`src/hooks/`)

### `useLocalStorage.js`

Generic hook that syncs `useState` to `localStorage` with JSON serialization.

```js
const [value, setValue] = useLocalStorage("key", initialValue);
```

Handles `localStorage` unavailability (private browsing) gracefully with a `try/catch`.

---

### `useTasks.js`

Convenience hook. Reads from `TaskContext` and exposes `useCallback`-memoized action helpers.

**Returns**: `{ tasks, visibleTasks, filter, sort, isLoading, stats, addTask, updateTask, deleteTask, toggleTask, reorder, setFilter, setSort }`

---

### `useAccentStyle.js`

Returns inline `style` objects derived from the current accent color.

**Returns**:

- `filled` — background + shadow for filled buttons/badges (respects gradient mode)
- `filledSm` — same but smaller shadow
- `text` — `{ color: accent.c500 }`
- `border` — `{ borderColor: accent.c500 }`
- `ring` — `{ '--tw-ring-color': accent.c500 }`
- `progress` — background for progress bar fill
- `gradientText` — gradient text or flat color depending on gradient mode
- `accent` — raw palette object `{ c400, c500, c600, c700, glow }`

---

### `useKeyboardShortcuts.js`

Attaches a `keydown` listener to `document`. Suppressed when focus is in `INPUT`, `TEXTAREA`, `SELECT`, or `contenteditable`.

**Shortcuts**:

- `N` or `Ctrl+N` → `onNewTask()`
- `/` → `onFocusSearch()`
- `Escape` → `onCloseModal()`

---

### `useReminders.js`

Runs a `setInterval` every 60 seconds. For each incomplete task with a due date within 24 hours, requests browser `Notification` permission and fires a notification. Uses a `useRef` Set to deduplicate notifications within a session.

---

## Layout Components (`src/components/layout/`)

### `Layout.jsx`

Root layout wrapper. Renders:

- `.app-bg` — the fixed gradient mesh background
- `Sidebar` — receives `isOpen`, `onClose`, `onNewTask`, `glassMode`
- `Header` — receives `onMenuClick`, `glassMode`
- `<main>` — scrollable content area

Manages `sidebarOpen` state for mobile drawer.

---

### `Sidebar.jsx`

Responsive navigation panel.

**Desktop** (≥1024px): Fixed 256px left panel, always visible.

**Mobile** (<1024px): Off-canvas drawer, slides in from left via Framer Motion spring animation. Backdrop overlay closes it on click.

**Sections**:

1. Logo (accent-colored orb + "Taskflow" gradient text)
2. New Task button (accent-filled)
3. Nav items (All Tasks / Active / Completed / Due Today) — active item gets accent background
4. Category list with color dots and active task counts
5. Footer tagline

Uses `useAccentStyle()` for all accent-colored elements.

---

### `Header.jsx`

Sticky top bar with glassmorphism background.

**Left**: Hamburger button (mobile only), "Taskflow" title (mobile only)

**Center**: `SearchInput` (grows to fill space)

**Right** (left to right):

1. `GlassToggle` — Layers/Square icon
2. `GradientToggle` — Sparkles icon
3. `ColorPicker` — Palette icon with color dot
4. `ThemeToggle` — Sun/Moon icon
5. Auth: Sign In button (when logged out) or user name + Sign Out button

---

## UI Primitives (`src/components/ui/`)

### `Button.jsx`

Reusable button with 5 variants and 4 sizes.

**Variants**: `primary` (accent-filled), `secondary` (slate), `ghost` (transparent), `danger` (red), `outline` (bordered)

**Sizes**: `sm`, `md`, `lg`, `icon`

**Features**: `loading` spinner state, `disabled` state, Framer Motion `whileHover` (scale 1.02) and `whileTap` (scale 0.97), `forwardRef` support.

Primary variant uses `useAccentStyle().filled` as inline style.

---

### `Badge.jsx`

Colored pill badge for priority levels and categories.

**Props**: `label`, `bgClass`, `textClass`, `className`

---

### `Modal.jsx`

Accessible dialog with:

- Focus trap (Tab cycles within modal, Shift+Tab reverses)
- `Escape` key closes
- Backdrop click closes
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Framer Motion scale + fade enter/exit animation
- Restores focus to trigger element on close

---

### `Skeleton.jsx`

Loading placeholder components.

- `SkeletonCard` — single animated shimmer card
- `SkeletonList({ count })` — renders N skeleton cards

Uses Tailwind `animate-pulse` for shimmer effect.

---

### `ThemeToggle.jsx`

Icon button that calls `toggleTheme()`. Animates Sun ↔ Moon icon swap using Framer Motion `AnimatePresence` with rotate + fade.

---

### `GlassToggle.jsx`

Icon button that calls `toggleGlass()`. Shows `Layers` icon (tinted accent) when glass is on, `Square` icon (grey) when off.

---

### `GradientToggle.jsx`

Icon button that calls `toggleGradient()`. When gradient mode is on, the button itself has an accent gradient background with the `Sparkles` icon in white. When off, the icon is grey.

---

### `ColorPicker.jsx`

Popover with 20 preset color swatches + Custom Color button.

**Preset grid**: 5 columns × 4 rows. Each swatch is a gradient circle (400→600 shade). Selected swatch has a ring + scale-up effect.

**Custom Color button**: White glassy (light mode) / black glassy (dark mode) button. Slides to `CustomColorPicker` panel.

**Bottom bar**: Shows current color name and hex value.

---

### `CustomColorPicker.jsx`

Full custom color picker panel (slides in from right inside the ColorPicker popover).

**Controls**:

1. **Color wheel** (`@uiw/react-color-wheel`) — pick hue and saturation
2. **Shade slider** (`@uiw/react-color-shade-slider`) — adjust brightness
3. **Hex input** — type `#RRGGBB` directly, with validation and live preview swatch
4. **RGB sliders** — individual R/G/B range sliders with color-coded tracks and number inputs
5. **Apply Color button** — calls `onApply(currentHex)` which triggers `applyCustomColor` in UIContext

---

### `SearchInput.jsx`

Debounced search field (300ms delay). Dispatches `SET_FILTER` with updated search string. Has a clear button when non-empty.

---

## Filter Components (`src/components/filters/`)

### `FilterBar.jsx`

Horizontal scrollable chip row. Three groups separated by dividers:

1. Status chips: All / Active / Completed
2. Category chips: Work / Personal / Shopping / Health / Learning (with color dots)
3. Priority chips: High / Medium / Low (with color dots)

Active chips use `useAccentStyle().filled` as inline style. "Clear" button appears when any filter is active.

---

### `SortMenu.jsx`

Native `<select>` dropdown for sort order. Options: Manual Order / Priority / Due Date / Creation Date / Status.

---

## Dashboard (`src/components/dashboard/`)

### `StatsPanel.jsx`

Collapsible overview panel.

**4 stat cards**: Total, Active, Completed, Progress %

**Progress bar**: Framer Motion spring-animated width. Uses `useAccentStyle().progress` for color.

**Celebration**: Shows "🎉 All tasks complete" when `pct === 100`.

Collapse state is local `useState` (not persisted).

---

## Task Components (`src/components/tasks/`)

### `TaskCard.jsx`

Individual task card. Uses `React.memo` to prevent re-renders when sibling tasks change.

**Visual elements**:

- Left priority color bar (4px wide, red/amber/green)
- Completion checkbox with `CheckCircle2` / `Circle` icons
- Title (strike-through when completed)
- Description (2-line clamp)
- Priority badge
- Category badges
- Due date chip (red if overdue, amber if due today)
- Edit and Delete action buttons (visible on hover/focus)

**Delete confirmation**: First click shows red background on delete button. Second click within 3 seconds confirms deletion. Auto-resets after 3 seconds.

**Drag handle**: `GripVertical` icon, visible on hover. Receives `dragHandleProps` from `SortableTaskCard`.

---

### `TaskList.jsx`

Sortable list container using `@dnd-kit`.

**Structure**:

```
DndContext (onDragEnd, sensors, closestCenter)
  SortableContext (items, verticalListSortingStrategy)
    AnimatePresence
      SortableTaskCard × N  (useSortable wrapper)
        TaskCard
```

`SortableTaskCard` is an internal wrapper that:

- Calls `useSortable({ id: task.id })`
- Applies `CSS.Transform.toString(transform)` and `transition` as inline styles
- Intercepts clicks on `[data-edit-btn]` to trigger `onEdit(task)`

Drag is disabled (pointer-events: none on handle) when `sort !== 'manual'`.

---

### `TaskForm.jsx`

Create/edit modal form.

**Fields**:

- Title (text input, required, inline validation)
- Description (textarea, optional)
- Priority (3-button segmented control: High / Medium / Low)
- Categories (multi-select chip picker)
- Due Date (`react-datepicker`)

**Behavior**:

- Pre-populates all fields when `editTask` prop is provided
- Validates title on blur and on submit
- Dispatches `ADD_TASK` or `UPDATE_TASK` on submit
- Fires success toast and closes modal

---

### `TaskEmpty.jsx`

Empty state shown when `visibleTasks.length === 0`.

Shows a `ClipboardList` icon, heading, description, and a "New Task" button. Animates in with Framer Motion.

---

## Auth Components (`src/components/auth/`)

### `AuthModal.jsx`

Authentication modal with two modes: Sign In and Sign Up.

**Controls**:

- Google sign-in button (calls `signInWithGoogle()`)
- Email input
- Password input
- Submit button (Sign In or Create Account)
- Mode toggle link

Shows a warning banner when Supabase is not configured. All buttons are disabled in that case.

---

## Library Files (`src/lib/`)

### `supabase.js`

Creates and exports the Supabase client. Returns `null` when credentials are placeholder values, so the app degrades gracefully.

Includes the SQL schema as a comment block for easy copy-paste into the Supabase SQL editor.

---

### `firebase.js`

Initializes Firebase app and Firestore. Only initializes when credentials are present. Exports `db` (Firestore instance) and `isFirebaseConfigured` flag.

Includes Firestore security rules as a comment block.

---

### `taskSync.js`

Unified sync layer. All functions are no-ops when backends are not configured.

**Supabase functions**:

- `fetchTasksFromSupabase(userId)` — fetch all tasks for user
- `upsertTaskToSupabase(task, userId)` — create or update one task
- `deleteTaskFromSupabase(taskId)` — delete one task
- `upsertAllTasksToSupabase(tasks, userId)` — bulk upsert (used on first sign-in)

**Firebase functions**:

- `fetchTasksFromFirestore(userId)` — fetch all tasks
- `upsertTaskToFirestore(task, userId)` — create or update one task
- `deleteTaskFromFirestore(taskId, userId)` — delete one task
- `subscribeToFirestoreTasks(userId, onUpdate)` — realtime listener, returns unsubscribe function

**Unified functions**:

- `syncTaskUpsert(task, userId)` — writes to both Supabase and Firestore in parallel
- `syncTaskDelete(taskId, userId)` — deletes from both in parallel

---

## Utilities (`src/utils/`)

### `constants.js`

Shared constants:

- `PRIORITIES` — array of `{ id, label, color, bgClass, textClass, dotClass }`
- `DEFAULT_CATEGORIES` — array of `{ id, label, color, bgClass, textClass }`
- `STATUS_FILTERS` — `[{ id: 'all' }, { id: 'active' }, { id: 'completed' }]`
- `SORT_OPTIONS` — `[{ id: 'manual' }, { id: 'priority' }, ...]`
- `PRIORITY_ORDER` — `{ high: 0, medium: 1, low: 2 }` for sort comparison

---

### `sampleData.js`

8 demo tasks seeded on first load. Covers:

- All 3 priority levels
- Multiple categories per task
- Past, today, and future due dates
- Mix of completed and incomplete tasks

---

### `taskHelpers.js`

Pure utility functions (no side effects):

- `filterTasks(tasks, filter)` — filters by status, category, priority
- `searchTasks(tasks, query)` — case-insensitive title/description search
- `sortTasks(tasks, sort)` — sorts by manual order, priority, due date, creation date, or status
- `getVisibleTasks(tasks, filter, sort)` — composes all three
- `isOverdue(task)` — true if due date is before today and task is incomplete
- `isDueToday(task)` — true if due date is today
- `isDueSoon(task)` — true if due date is within 24 hours (used by reminder hook)
