# User Guide

Complete guide to using every feature in Taskflow.

---

## Getting Started

When you open the app for the first time, 8 sample tasks are loaded automatically so you can explore the interface immediately. All your changes are saved to the browser automatically — you never need to click a save button.

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Search | Glass | Gradient | Colors | Theme | Auth│
├──────────────┬──────────────────────────────────────────┤
│              │  STATS PANEL (collapsible)               │
│   SIDEBAR    ├──────────────────────────────────────────┤
│              │  FILTER BAR | SORT MENU                  │
│  Navigation  ├──────────────────────────────────────────┤
│  Categories  │                                          │
│              │  TASK LIST                               │
│  New Task    │  (scrollable)                            │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

On mobile, the sidebar collapses. Tap the ☰ hamburger icon in the header to open it.

---

## Creating a Task

**3 ways to open the New Task form:**

1. Click **New Task** button in the sidebar
2. Press **N** on your keyboard (when not typing in an input)
3. Press **Ctrl+N** on your keyboard

**Form fields:**

| Field       | Required | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------- |
| Title       | Yes      | What needs to be done                                         |
| Description | No       | Additional details                                            |
| Priority    | No       | High / Medium / Low (default: Medium)                         |
| Categories  | No       | One or more tags (Work, Personal, Shopping, Health, Learning) |
| Due Date    | No       | Pick a date from the calendar                                 |

Click **Create Task** to save. A green toast notification confirms the task was created.

---

## Editing a Task

Hover over any task card — an **edit (pencil) icon** appears in the top-right corner. Click it to open the edit form pre-filled with the task's current values.

Make your changes and click **Save Changes**.

---

## Completing a Task

Click the **circle checkbox** on the left side of any task card. The task title gets a strikethrough and the card dims slightly. Click again to mark it incomplete.

A toast notification confirms the action.

---

## Deleting a Task

Hover over a task card — a **trash icon** appears.

- **First click**: The trash icon turns red (confirmation mode)
- **Second click within 3 seconds**: Task is deleted
- **If you don't click again**: Confirmation resets automatically after 3 seconds

This two-step confirmation prevents accidental deletions.

---

## Searching Tasks

Click the **search bar** in the header, or press **/** on your keyboard to jump to it.

Type any text — the task list updates in real time (300ms debounce) showing only tasks whose title or description contains your search text. The search is case-insensitive.

Click the **✕** button inside the search bar to clear it.

---

## Filtering Tasks

The **Filter Bar** sits below the stats panel. It has three groups of chips:

**Status filters** (pick one):

- **All** — shows every task
- **Active** — shows only incomplete tasks
- **Completed** — shows only completed tasks

**Category filters** (pick one):

- Work, Personal, Shopping, Health, Learning
- Each has a colored dot matching the category color

**Priority filters** (pick one):

- High (red dot), Medium (amber dot), Low (green dot)

Multiple filter types can be active at the same time (e.g. Active + Work + High).

Click **Clear** (red button, appears when any filter is active) to reset all filters at once.

---

## Sorting Tasks

The **Sort Menu** is on the right side of the filter bar. Click the dropdown to choose:

| Sort Option   | Description                               |
| ------------- | ----------------------------------------- |
| Manual Order  | Your custom drag-and-drop order (default) |
| Priority      | High → Medium → Low                       |
| Due Date      | Earliest first, no-date tasks last        |
| Creation Date | Newest first                              |
| Status        | Incomplete tasks first                    |

---

## Drag-and-Drop Reordering

When **Sort** is set to **Manual Order**, you can drag tasks to reorder them.

1. Hover over a task card — a **grip handle** (⠿) appears on the left
2. Click and drag the handle to move the task
3. Drop it at the new position

The new order is saved automatically.

**Note**: Drag-and-drop is disabled when any other sort option is active. A message at the top of the list explains this.

**Keyboard drag**: Press **Space** on the grip handle to pick up a task, use **Arrow keys** to move it, press **Space** or **Enter** to drop.

---

## Task Priority Levels

Each task has a colored left border indicating priority:

| Priority | Color | Meaning                     |
| -------- | ----- | --------------------------- |
| High     | Red   | Urgent, do first            |
| Medium   | Amber | Normal importance (default) |
| Low      | Green | Can wait                    |

Priority is also shown as a colored badge on the task card.

---

## Due Dates

When a task has a due date, a calendar chip appears on the card:

| State       | Color | Meaning                      |
| ----------- | ----- | ---------------------------- |
| Future date | Grey  | Due in the future            |
| Due today   | Amber | Due today                    |
| Overdue     | Red   | Past due date, not completed |

**Browser reminders**: If you grant notification permission, the app will send a browser notification for any incomplete task due within the next 24 hours. Notifications are checked every 60 seconds.

---

## Categories

Tasks can belong to multiple categories. Each category has a distinct color:

| Category | Color  |
| -------- | ------ |
| Work     | Indigo |
| Personal | Pink   |
| Shopping | Teal   |
| Health   | Orange |
| Learning | Violet |

Category badges appear on each task card. Click a category in the sidebar or filter bar to show only tasks in that category.

---

## Progress Dashboard

The **Stats Panel** at the top of the main area shows:

- **Total** — total number of tasks in the current view
- **Active** — incomplete tasks
- **Completed** — completed tasks
- **Progress** — completion percentage with an animated bar

When all tasks are complete, a 🎉 celebration message appears.

Click the **chevron (∧/∨)** button to collapse or expand the panel.

---

## Keyboard Shortcuts

| Shortcut     | Action                                      |
| ------------ | ------------------------------------------- |
| `N`          | Open new task form                          |
| `Ctrl+N`     | Open new task form                          |
| `/`          | Focus the search input                      |
| `Escape`     | Close any open modal or form                |
| `Tab`        | Navigate between interactive elements       |
| `Space`      | Pick up / drop a task (drag handle focused) |
| `Arrow keys` | Move a picked-up task                       |

Shortcuts are suppressed when you are typing in an input field.

---

## Theme Toggle (Dark / Light Mode)

Click the **Sun/Moon icon** in the header to switch between dark and light mode. The transition is smooth (300ms).

Your preference is saved and restored on every visit. If you've never set a preference, the app follows your operating system's dark/light setting.

---

## Glass Mode Toggle

Click the **Layers icon** (next to the theme toggle) to switch between:

- **Glass mode ON** (default): Sidebar, header, cards, and panels use frosted glass — semi-transparent with blur effect. Requires the animated gradient background to look its best.
- **Glass mode OFF**: All surfaces use solid white/dark backgrounds.

---

## Gradient Mode Toggle

Click the **Sparkles (✨) icon** to toggle gradient mode:

- **Gradient ON** (default): Buttons, active nav items, filter chips, progress bar, logo, and app title all use gradient fills (accent color → darker shade).
- **Gradient OFF**: All accent surfaces use a flat solid color.

---

## Color Picker

Click the **Palette icon** (with a small color dot) to open the color picker.

**20 preset colors** are arranged in a 5-column grid:

- Row 1: Indigo, Violet, Purple, Fuchsia
- Row 2: Pink, Rose, Red, Orange
- Row 3: Amber, Yellow, Lime, Green
- Row 4: Emerald, Teal, Cyan, Sky
- Row 5: Blue, Cobalt, Slate, Crimson

Click any swatch to apply it instantly. The selected color gets a ring highlight.

**Custom Color**: Click the **Custom Color** button at the bottom of the picker to open the custom color panel:

1. **Color wheel** — drag to pick any hue and saturation
2. **Brightness slider** — adjust lightness
3. **Hex input** — type a hex code directly (e.g. `FF6B35`)
4. **RGB sliders** — fine-tune individual red, green, blue channels
5. Click **Apply Color** to use your custom color

The bottom bar always shows the current color name and hex value.

---

## Sign In / Cloud Sync

Click **Sign in** in the header to open the authentication modal.

**Options**:

- **Continue with Google** — one-click OAuth sign-in
- **Email + Password** — traditional sign-in or create a new account

**When signed in**:

- Your tasks are synced to Supabase (primary database)
- Changes are mirrored to Firebase Firestore for realtime sync across devices
- Your username (email prefix) appears in the header
- Click the **sign-out icon** to sign out

**When not signed in**:

- The app works fully offline using browser localStorage
- Tasks are not synced across devices

**Note**: Cloud sync requires Supabase and Firebase credentials to be configured in the `.env` file. If not configured, a warning is shown in the auth modal.

---

## Mobile Usage

On screens narrower than 1024px:

- The sidebar is hidden by default
- Tap the **☰ hamburger icon** in the header to open the sidebar drawer
- Tap anywhere outside the drawer to close it
- All task cards stack in a single column
- The filter bar scrolls horizontally
- All touch targets are at least 44×44px for comfortable tapping

---

## Accessibility

Taskflow is built with accessibility in mind:

- All interactive elements have visible focus rings
- All icons have `aria-label` or `aria-hidden` attributes
- Modals trap focus and restore it on close
- Toast notifications are announced by screen readers via ARIA live regions
- Drag-and-drop supports full keyboard operation
- Color is never the sole indicator of meaning (priority also shown as text)
- The app is fully navigable with keyboard only
