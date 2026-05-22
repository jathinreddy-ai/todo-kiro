# Todo App — Requirements

## Introduction

A modern, production-quality Todo application built with React + Vite and Tailwind CSS. The app targets individual users who want a polished, fast, and fully offline-capable task management experience. It draws aesthetic inspiration from Apple, Notion, and Linear — featuring glassmorphism, smooth gradients, micro-interactions, and Framer Motion animations. All data is persisted in the browser's local storage; no backend or authentication is required.

---

## Glossary

| Term            | Definition                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| Task            | A single to-do item with a title, optional description, priority, category, due date, and completion status |
| Category        | A user-defined or preset label (with a color) used to group related tasks                                   |
| Priority        | One of three levels — High, Medium, or Low — indicating task urgency                                        |
| Due Date        | An optional calendar date by which a task should be completed                                               |
| Reminder        | A browser notification triggered when a task's due date is approaching or has passed                        |
| Dark/Light Mode | A global UI theme toggle persisted in local storage                                                         |
| Toast           | A brief, auto-dismissing notification shown after a user action                                             |
| Drag-and-Drop   | The ability to reorder tasks within a list by dragging them                                                 |

---

## Requirements

### Requirement 1: Task Management (CRUD)

**User Story:** As a user, I want to add, edit, delete, and mark tasks as complete so that I can manage my to-do list effectively.

#### Acceptance Criteria

1. WHEN the user submits the task creation form with a non-empty title, THEN a new task SHALL be added to the active task list and a success toast SHALL appear.
2. WHEN the user submits the task creation form with an empty title, THEN the system SHALL display an inline validation error and SHALL NOT create a task.
3. WHEN the user clicks the edit action on a task, THEN an edit form SHALL open pre-populated with the task's current values.
4. WHEN the user saves an edited task, THEN the task SHALL reflect the updated values immediately in the list.
5. WHEN the user clicks the delete action on a task, THEN a confirmation prompt SHALL appear; upon confirmation the task SHALL be removed and a toast SHALL confirm deletion.
6. WHEN the user toggles the completion checkbox on a task, THEN the task's completion status SHALL toggle and the UI SHALL reflect the change with a visual strike-through and color change.
7. IF a task is marked complete, THEN it SHALL move to or remain in the "Completed" filter view and SHALL be visually distinguished from active tasks.

---

### Requirement 2: Task Attributes

**User Story:** As a user, I want to assign priority levels, categories, and due dates to tasks so that I can organize and prioritize my work.

#### Acceptance Criteria

1. WHEN creating or editing a task, the user SHALL be able to select a priority level of High, Medium, or Low; the default SHALL be Medium.
2. WHEN creating or editing a task, the user SHALL be able to assign one or more categories from a predefined and user-extendable list, each with a distinct color.
3. WHEN creating or editing a task, the user SHALL be able to set an optional due date using a date picker.
4. WHEN a task has a due date that is today or in the past and the task is not complete, THEN the due date SHALL be displayed in a warning color (e.g., red/amber).
5. WHEN a task has a due date within the next 24 hours and the task is not complete, THEN the system SHALL display a browser notification reminder IF the user has granted notification permission.
6. WHEN a task has no due date, THEN no due date indicator SHALL be shown.

---

### Requirement 3: Search and Filter

**User Story:** As a user, I want to search and filter tasks so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. WHEN the user types in the search input, THEN the task list SHALL update in real time to show only tasks whose title or description contains the search string (case-insensitive).
2. WHEN the user selects a filter (All, Active, Completed), THEN the task list SHALL show only tasks matching that status.
3. WHEN the user selects a category filter, THEN the task list SHALL show only tasks belonging to that category.
4. WHEN the user selects a priority filter, THEN the task list SHALL show only tasks with that priority level.
5. WHEN multiple filters are active simultaneously, THEN the task list SHALL show only tasks that satisfy ALL active filters.
6. WHEN no tasks match the active filters, THEN an empty state illustration and message SHALL be displayed.

---

### Requirement 4: Sorting

**User Story:** As a user, I want to sort tasks by different criteria so that I can view them in the order most useful to me.

#### Acceptance Criteria

1. WHEN the user selects "Sort by Priority", THEN tasks SHALL be ordered High → Medium → Low within the current filter view.
2. WHEN the user selects "Sort by Due Date", THEN tasks SHALL be ordered from earliest to latest due date; tasks with no due date SHALL appear last.
3. WHEN the user selects "Sort by Creation Date", THEN tasks SHALL be ordered from newest to oldest.
4. WHEN the user selects "Sort by Completion Status", THEN incomplete tasks SHALL appear before completed tasks.
5. WHEN no sort is selected, THEN tasks SHALL maintain their drag-and-drop order.

---

### Requirement 5: Drag-and-Drop Reordering

**User Story:** As a user, I want to reorder tasks by dragging and dropping them so that I can arrange my list in a custom order.

#### Acceptance Criteria

1. WHEN the user drags a task card and drops it at a new position, THEN the task list SHALL reorder to reflect the new position immediately.
2. WHEN drag-and-drop reordering occurs, THEN the new order SHALL be persisted to local storage.
3. WHEN a sort option other than the default (manual) order is active, THEN drag-and-drop SHALL be disabled and a tooltip SHALL inform the user.
4. WHEN a task is being dragged, THEN a visual placeholder SHALL indicate the drop target position.

---

### Requirement 6: Progress Dashboard

**User Story:** As a user, I want to see statistics about my tasks so that I can track my overall productivity.

#### Acceptance Criteria

1. WHEN the dashboard is visible, THEN it SHALL display the total number of tasks, the number of completed tasks, the number of active tasks, and a completion percentage.
2. WHEN the completion percentage changes, THEN an animated progress bar SHALL update to reflect the new value.
3. WHEN tasks are filtered by category, THEN the dashboard statistics SHALL reflect only the tasks in the current view.
4. WHEN all tasks are completed, THEN a congratulatory message or animation SHALL be displayed.

---

### Requirement 7: Dark / Light Mode

**User Story:** As a user, I want to toggle between dark and light mode so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the user clicks the theme toggle, THEN the UI SHALL switch between dark and light mode with a smooth CSS transition (≤ 300 ms).
2. WHEN the app loads, THEN it SHALL restore the last saved theme from local storage; IF no preference is saved, THEN it SHALL default to the user's OS preference via `prefers-color-scheme`.
3. WHEN dark mode is active, THEN all text, backgrounds, borders, and icons SHALL meet WCAG AA contrast requirements.

---

### Requirement 8: Persistent Storage

**User Story:** As a user, I want my tasks and preferences to be saved automatically so that I don't lose data when I close or refresh the browser.

#### Acceptance Criteria

1. WHEN any task is created, edited, deleted, reordered, or its status changes, THEN the updated task list SHALL be written to local storage within 500 ms.
2. WHEN the app loads, THEN it SHALL read tasks from local storage and render them before displaying the main UI.
3. WHEN local storage is empty on first load, THEN the app SHALL populate it with a set of sample dummy tasks for demo purposes.
4. WHEN local storage is unavailable (e.g., private browsing with storage blocked), THEN the app SHALL display a non-blocking warning toast and operate in-memory for the session.

---

### Requirement 9: Responsive Layout and Navigation

**User Story:** As a user, I want the app to work well on desktop, tablet, and mobile so that I can use it on any device.

#### Acceptance Criteria

1. WHEN the viewport is ≥ 1024 px wide, THEN a persistent sidebar navigation SHALL be visible alongside the main content area.
2. WHEN the viewport is < 1024 px wide, THEN the sidebar SHALL collapse and be accessible via a hamburger/menu button.
3. WHEN the sidebar is open on mobile, THEN tapping outside it SHALL close it.
4. WHEN the viewport is < 640 px wide, THEN task cards SHALL stack in a single column with touch-friendly tap targets (≥ 44 × 44 px).
5. WHEN the layout changes between breakpoints, THEN transitions SHALL be smooth and no content SHALL overflow or be clipped.

---

### Requirement 10: Animations and Visual Design

**User Story:** As a user, I want the app to feel polished and responsive to my interactions so that using it is enjoyable.

#### Acceptance Criteria

1. WHEN a task is added, THEN it SHALL animate into the list (e.g., slide-in or fade-in via Framer Motion).
2. WHEN a task is deleted, THEN it SHALL animate out of the list before being removed from the DOM.
3. WHEN the user hovers over interactive elements (buttons, cards, icons), THEN subtle hover effects (scale, shadow, color shift) SHALL be applied.
4. WHEN the app is loading data from local storage, THEN skeleton loading placeholders SHALL be shown.
5. WHEN the task list is empty, THEN an illustrated empty state with a friendly message SHALL be displayed.
6. WHEN the user performs an action (create, edit, delete, complete), THEN a toast notification SHALL appear and auto-dismiss after 3 seconds.

---

### Requirement 11: Keyboard Shortcuts and Accessibility

**User Story:** As a user, I want to use keyboard shortcuts and have the app be accessible so that I can work efficiently and the app is usable by everyone.

#### Acceptance Criteria

1. WHEN the user presses `N` (or `Ctrl+N`), THEN the new task form SHALL open.
2. WHEN the user presses `Escape`, THEN any open modal or form SHALL close.
3. WHEN the user presses `/`, THEN focus SHALL move to the search input.
4. ALL interactive elements SHALL have visible focus indicators that meet WCAG AA standards.
5. ALL images and icons SHALL have appropriate `alt` text or `aria-label` attributes.
6. WHEN a toast notification appears, THEN it SHALL be announced by screen readers via an ARIA live region.
7. THE app SHALL be fully navigable using only a keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys where applicable).
