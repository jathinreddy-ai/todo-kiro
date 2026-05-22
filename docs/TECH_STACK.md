# Tech Stack & Tools

## Frontend Framework

### React 19

- **What**: UI library for building component-based interfaces
- **Why**: Concurrent features, built-in hooks, no need for external state management
- **Key features used**: `useState`, `useReducer`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useRef`, `forwardRef`

### Vite 8

- **What**: Build tool and development server
- **Why**: Extremely fast HMR (Hot Module Replacement), native ES modules, minimal config
- **Config file**: `vite.config.js`
- **Key scripts**: `npm run dev` (dev server), `npm run build` (production build), `npm run preview`

---

## Styling

### Tailwind CSS v3

- **What**: Utility-first CSS framework
- **Why**: Rapid UI development, dark mode via `class` strategy, JIT compilation
- **Config**: `tailwind.config.js`
  - `darkMode: 'class'` — dark mode toggled by adding `dark` class to `<html>`
  - Custom `brand` color scale (50–900, indigo-based)
  - Custom `priority` colors (high/medium/low)
  - Custom `fontFamily.sans` pointing to Inter
- **PostCSS**: `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins

### Custom CSS (`src/index.css`)

- Tailwind directives (`@tailwind base/components/utilities`)
- CSS custom properties for dynamic accent color (`--accent-500`, `--accent-600`, etc.)
- `.glass` and `.glass-card` classes — real glassmorphism with `backdrop-filter: blur()`
- `.solid-card` — fallback for non-glass mode
- `.app-bg` — animated gradient mesh background with floating orbs
- `.gradient-mode` selector rules — respond to the gradient toggle
- Accent utility classes (`.accent-text`, `.accent-bg`, `.accent-ring`, etc.)
- `@keyframes orbFloat` — smooth floating animation for background orbs

---

## Animation

### Framer Motion 12

- **What**: Production-ready animation library for React
- **Why**: Declarative enter/exit animations, spring physics, drag support
- **Used for**:
  - Task card enter (`opacity: 0, y: 20` → `opacity: 1, y: 0`) and exit (`opacity: 0, x: -40, scale: 0.95`)
  - Modal scale-in/out (`scale: 0.95, y: 10` → `scale: 1, y: 0`)
  - Sidebar mobile drawer slide (`x: -280` → `x: 0`)
  - Progress bar width animation (spring transition)
  - Theme toggle icon swap (rotate + fade)
  - Gradient toggle icon swap
  - Color picker popover scale-in
  - Stats panel collapse/expand
  - `AnimatePresence` for unmount animations

---

## Drag and Drop

### @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities

- **What**: Accessible, modular drag-and-drop toolkit
- **Why**: Works with Framer Motion, keyboard accessible, no jQuery dependency
- **Components used**:
  - `DndContext` — root drag context with collision detection
  - `SortableContext` — manages sortable item list
  - `useSortable` — hook for each draggable item
  - `arrayMove` — utility to recompute array order after drop
  - `closestCenter` — collision detection algorithm
  - `PointerSensor` — mouse/touch drag (activates after 8px movement)
  - `KeyboardSensor` — keyboard drag (Space to pick up, arrows to move)
  - `CSS.Transform.toString` — converts dnd-kit transform to CSS string

---

## Icons

### lucide-react 1.16

- **What**: Tree-shakeable SVG icon library
- **Why**: Consistent stroke style, small bundle size, React components
- **Icons used**: `CheckSquare`, `Calendar`, `Clock`, `CheckCircle2`, `Plus`, `Tag`, `LayoutDashboard`, `Search`, `X`, `Menu`, `LogIn`, `LogOut`, `User`, `Sun`, `Moon`, `Layers`, `Square`, `Palette`, `Sparkles`, `Pipette`, `ArrowLeft`, `Check`, `Pencil`, `Trash2`, `GripVertical`, `Circle`, `ListTodo`, `TrendingUp`, `ChevronDown`, `ChevronUp`, `ArrowUpDown`, `ClipboardList`, `Mail`, `Lock`, `Globe`

---

## Notifications

### react-hot-toast 2.6

- **What**: Lightweight toast notification library
- **Why**: Accessible, customizable, tiny bundle
- **Used for**: Task created, task updated, task deleted, task completed, sign-in/out, storage warnings
- **Config**: `position: 'bottom-right'`, `duration: 3000ms`, custom border-radius and font

---

## Date Picker

### react-datepicker 9.1

- **What**: Accessible date picker component
- **Why**: Keyboard navigable, customizable, well-maintained
- **Used in**: `TaskForm` for due date selection
- **Dark mode**: Custom CSS overrides in `index.css` for dark theme

---

## Unique IDs

### nanoid 5.1

- **What**: Tiny, URL-safe unique ID generator
- **Why**: Smaller than UUID, no dependencies, cryptographically secure
- **Used in**: `TaskContext` reducer `ADD_TASK` action to generate task IDs

---

## Custom Color Picker

### @uiw/react-color 2.10

- **What**: Collection of color picker components
- **Why**: Includes color wheel, shade slider, and color conversion utilities
- **Components used**:
  - `Wheel` — HSV color wheel
  - `ShadeSlider` — brightness/shade slider
  - `hsvaToHex`, `hexToHsva`, `hsvaToRgba`, `rgbaToHsva` — color conversion utilities

---

## Backend — Supabase

### @supabase/supabase-js 2.106

- **What**: JavaScript client for Supabase (PostgreSQL + Auth + Realtime)
- **Why**: Primary database, handles auth (Google OAuth + email/password), row-level security
- **Used for**:
  - `supabase.auth.signInWithOAuth` — Google sign-in
  - `supabase.auth.signInWithPassword` — email/password sign-in
  - `supabase.auth.signUp` — account creation
  - `supabase.auth.onAuthStateChange` — session listener
  - `supabase.from('tasks').select()` — fetch tasks
  - `supabase.from('tasks').upsert()` — create/update tasks
  - `supabase.from('tasks').delete()` — delete tasks
- **Config**: `src/lib/supabase.js`
- **Credentials**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env`

---

## Backend — Firebase

### firebase 12.13

- **What**: Google's app platform — using Firestore for realtime sync
- **Why**: Realtime `onSnapshot` listener enables live sync across tabs/devices
- **Used for**:
  - `getFirestore` — Firestore database instance
  - `collection`, `doc` — document references
  - `setDoc` — write/update task
  - `deleteDoc` — delete task
  - `getDocs` — fetch all tasks
  - `onSnapshot` — realtime listener for live updates
  - `writeBatch` — atomic batch writes
- **Config**: `src/lib/firebase.js`
- **Credentials**: `VITE_FIREBASE_*` variables in `.env`

---

## Build Tools

| Tool                        | Version | Purpose                           |
| --------------------------- | ------- | --------------------------------- |
| Vite                        | 8.0     | Build tool, dev server, HMR       |
| @vitejs/plugin-react        | 6.0     | React JSX transform, Fast Refresh |
| PostCSS                     | 8.5     | CSS processing pipeline           |
| Autoprefixer                | 10.5    | Vendor prefix injection           |
| ESLint                      | 10.3    | Code linting                      |
| eslint-plugin-react-hooks   | 7.1     | React hooks rules                 |
| eslint-plugin-react-refresh | 0.5     | Fast Refresh compatibility        |

---

## Language

- **JavaScript (ES2022)** — no TypeScript
- **JSX** — React component syntax
- **ES Modules** (`"type": "module"` in package.json)
- **Modern syntax**: optional chaining (`?.`), nullish coalescing (`??`), destructuring, spread, async/await, template literals
