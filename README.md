# Taskflow

A modern, production-quality Todo application built with React + Vite + Tailwind CSS. Inspired by Apple, Notion, and Linear aesthetics.

## Features

- Add, edit, delete, and complete tasks
- Drag-and-drop reordering
- Priority levels (High / Medium / Low)
- Due dates with overdue indicators and browser reminders
- Search, filter by status / category / priority
- Sort by priority, date, creation time, or status
- Progress statistics dashboard
- Dark / light mode
- Glassmorphism UI toggle
- Gradient mode toggle
- 20 preset accent colors + custom color picker (wheel, hex, RGB)
- Responsive sidebar navigation
- Keyboard shortcuts
- Persistent localStorage
- Supabase cloud sync (optional)
- Firebase realtime sync (optional)
- Google + email/password authentication (optional)

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Documentation

Full documentation is in the [`docs/`](./docs/) folder:

| Doc                                    | Contents                                      |
| -------------------------------------- | --------------------------------------------- |
| [Architecture](./docs/ARCHITECTURE.md) | System design, data flow, component hierarchy |
| [Tech Stack](./docs/TECH_STACK.md)     | Every library and tool used                   |
| [Components](./docs/COMPONENTS.md)     | Every file explained                          |
| [User Guide](./docs/USER_GUIDE.md)     | How to use all features                       |
| [Backend](./docs/BACKEND.md)           | Supabase, Firebase, auth, DB schema           |
| [Setup](./docs/SETUP.md)               | Installation, env vars, deployment            |

## Tech Stack

| Layer        | Technology                |
| ------------ | ------------------------- |
| Framework    | React 19 + Vite 8         |
| Styling      | Tailwind CSS v3           |
| Animation    | Framer Motion 12          |
| Drag & Drop  | @dnd-kit                  |
| Icons        | lucide-react              |
| Toasts       | react-hot-toast           |
| Date Picker  | react-datepicker          |
| Color Picker | @uiw/react-color          |
| Primary DB   | Supabase (PostgreSQL)     |
| Realtime     | Firebase Firestore        |
| Auth         | Supabase (Google + email) |
| IDs          | nanoid                    |

## Environment Variables

Copy `.env.example` to `.env` and fill in credentials (optional — app works offline without them):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Keyboard Shortcuts

| Key            | Action       |
| -------------- | ------------ |
| `N` / `Ctrl+N` | New task     |
| `/`            | Focus search |
| `Escape`       | Close modal  |
